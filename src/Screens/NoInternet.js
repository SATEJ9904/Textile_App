import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";


const initialBoard = Array(9).fill(null);

const NoInternet = () => {
  const [board, setBoard] = useState(initialBoard);
  const [userScore, setUserScore] = useState(0);
  const [systemScore, setSystemScore] = useState(0);
  const [userTurn, setUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const [showmsg, setShowMsg] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);

      if (state.isConnected) {
        setTimeout(() => {
          setShowMsg(false);
        }, 5000);
      } else {
        setShowMsg(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userTurn && !winner) {
      // AI's turn
      setTimeout(() => {
        const bestMove = getBestMove(board, 'O');
        handleCellPress(bestMove);
      }, 500); // Adjust the delay as needed for medium level difficulty
    }
  }, [userTurn, winner]);

  const handleCellPress = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = userTurn ? 'X' : 'O';
    setBoard(newBoard);
    setUserTurn(!userTurn);
    checkWinner(newBoard);
  };

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
    if (!board.includes(null)) {
      setWinner('tie');
    }
  };

  const handleRestart = () => {
    setBoard(initialBoard);
    setWinner(null);
  };

  const renderCell = (index) => (
    <TouchableOpacity style={styles.cell} onPress={() => handleCellPress(index)}>
      <Text style={styles.cellText}>{board[index]}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
         <Text style={{color:"#000",fontSize:25,margin:"20%",fontWeight:"800",marginTop:"15%"}}> {isConnected ? 'Hurray You Are Back Online' : 'Lets Have Fun Till Internet Comes'}</Text>
      <View style={styles.board}>
        {renderCell(0)}
        {renderCell(1)}
        {renderCell(2)}
        {renderCell(3)}
        {renderCell(4)}
        {renderCell(5)}
        {renderCell(6)}
        {renderCell(7)}
        {renderCell(8)}
      </View>
      <Text style={styles.score}>User Score: {userScore}</Text>
      <Text style={styles.score}>System Score: {systemScore}</Text>
      {winner && (
        <View>
          {winner === 'tie' ? (
            <Text style={styles.resultText}>It's a tie!</Text>
          ) : (
            <Text style={styles.resultText}>{winner} wins!</Text>
          )}
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>Restart</Text>
          </TouchableOpacity>
          {
        showmsg ? <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
          <View style={{
            bottom: 0,
            height: 20,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isConnected ? 'green' : 'red'

          }}>
            <Text style={{ color: "#fff" }}>
              {isConnected ? 'Back Online' : 'no Internet Connection'}
            </Text>

          </View>
        </View> : null
      }
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    marginBottom: 20,
  },
  cell: {
    width: 100,
    height: 100,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cellText: {
    fontSize: 40,
    color: '#fff',
  },
  score: {
    fontSize: 20,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  restartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NoInternet;
