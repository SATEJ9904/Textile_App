import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const CalculationScreen = () => {
    const [inputs, setInputs] = useState({
        epi: '',
        fabricWidth: '',
        warpCrimp: '',
        warpCount: '',
        warpWaste: '',
        warpYarnRate: '',
        weftYarnRate: '',
        ppi: '',
        weftCrimp: '',
        weftCount: '',
        weftWaste: '',
        sizingRate: '',
        jobWorkRate: '',
        loomSpeed: '',
        time: '',
        efficiency: '',
        orderQuantity: '',
        ppi7: '',
        ppi8: '',
    });

    const [results, setResults] = useState({
        warpWeight: '',
        weftWeight: '',
        warpCost: '',
        weftCost: '',
        sizingCost: '',
        weavingCost: '',
        totalFabricCost: '',
        jobWorkBilling: '',
        expectedProduction: '',
        expectedTime: '',
    });

    const handleChange = (name, value) => {
        setInputs({ ...inputs, [name]: value });
    };

    const calculateWarpWeight = () => {
        const { epi, fabricWidth, warpCrimp, warpCount, warpWaste, warpYarnRate } = inputs;
        const netWarpWeight = (epi * fabricWidth * 0.59 * (100 + parseFloat(warpCrimp))) / (warpCount * 100000);
        const grossWarpWeight = netWarpWeight * (1 + parseFloat(warpWaste) / 100);
        const warpCost = grossWarpWeight * warpYarnRate;
        setResults({ ...results, warpWeight: grossWarpWeight.toFixed(2), warpCost: warpCost.toFixed(2) });
    };

    const calculateWeftWeight = () => {
        const { ppi, fabricWidth, weftCrimp, weftCount, weftWaste, weftYarnRate } = inputs;
        const netWeftWeight = (ppi * fabricWidth * 0.59 * (100 + parseFloat(weftCrimp))) / (weftCount * 100000);
        const grossWeftWeight = netWeftWeight * (1 + parseFloat(weftWaste) / 100);
        const weftCost = grossWeftWeight * weftYarnRate;
        setResults({ ...results, weftWeight: grossWeftWeight.toFixed(2), weftCost: weftCost.toFixed(2) });
    };

    const calculateSizingCost = () => {
        const { sizingRate } = inputs;
        const totalSizingCost = sizingRate * parseFloat(results.warpWeight);
        setResults({ ...results, sizingCost: totalSizingCost.toFixed(2) });
    };

    const calculateWeavingCost = () => {
        const { jobWorkRate, ppi } = inputs;
        const weavingCost = jobWorkRate * ppi;
        setResults({ ...results, weavingCost: weavingCost.toFixed(2) });
    };

    const calculateTotalFabricCost = () => {
        const totalFabricCost = parseFloat(results.warpCost) + parseFloat(results.weftCost) + parseFloat(results.sizingCost) + parseFloat(results.weavingCost);
        setResults({ ...results, totalFabricCost: totalFabricCost.toFixed(2) });
    };

    const calculateJobWorkBilling = () => {
        const { jobWorkRate } = inputs;
        const jobWorkBilling =ppi * (jobWorkRate / 100)
        setResults({ ...results, jobWorkBilling: jobWorkBilling.toFixed(2) });
    };

    const calculateExpectedProduction = () => {
        const { loomSpeed, efficiency, time, ppi7 } = inputs;
        const expectedProduction = (loomSpeed * time * 60 * (efficiency / 100)) / (ppi7 * 39.37);
        setResults({ ...results, expectedProduction: expectedProduction.toFixed(2) });
    };

    const calculateExpectedTime = () => {
        const { orderQuantity, loomSpeed, efficiency, ppi8 } = inputs;
        const expectedTime = (orderQuantity * ppi8 * 39.37) / (loomSpeed * 60 * (efficiency / 100));
        setResults({ ...results, expectedTime: expectedTime.toFixed(2) });
    };
    

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Textile Cost Calculator</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Warp Weight Calculation</Text>
                <Text style={styles.label}>EPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('epi', value)} />

                <Text style={styles.label}>Fabric Width (inches)</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('fabricWidth', value)} />

                <Text style={styles.label}>Warp Crimp %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('warpCrimp', value)} />

                <Text style={styles.label}>Warp Count</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('warpCount', value)} />

                <Text style={styles.label}>Warp Waste %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('warpWaste', value)} />

                <Text style={styles.label}>Warp Yarn Rate (per Kg)</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('warpYarnRate', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateWarpWeight}>
                    <Text style={styles.buttonText}>Calculate Warp Weight</Text>
                </TouchableOpacity>
                {results.warpWeight !== '' && (
                    <View>
                        <Text style={styles.result}>Warp Weight: {results.warpWeight} KG</Text>
                        <Text style={styles.result}> Cost: {results.warpCost} ₹</Text>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weft Weight Calculation</Text>
                <Text style={styles.label}>PPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('ppi', value)} />

                <Text style={styles.label}>Fabric Width (inches)</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('fabricWidth', value)} />

                <Text style={styles.label}>Weft Crimp %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('weftCrimp', value)} />

                <Text style={styles.label}>Weft Count</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('weftCount', value)} />

                <Text style={styles.label}>Weft Waste %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('weftWaste', value)} />

                <Text style={styles.label}>Weft Yarn Rate (per Kg)</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('weftYarnRate', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateWeftWeight}>
                    <Text style={styles.buttonText}>Calculate Weft Weight</Text>
                </TouchableOpacity>
                {results.weftWeight !== '' && (
                    <View>
                        <Text style={styles.result}>Weft Weight: {results.weftWeight} KG</Text>
                        <Text style={styles.result}> Cost: {results.weftCost} ₹</Text>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sizing Cost Calculation</Text>
                <Text style={styles.label}>Sizing Rate</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('sizingRate', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateSizingCost}>
                    <Text style={styles.buttonText}>Calculate Sizing Cost</Text>
                </TouchableOpacity>
                {results.sizingCost !== '' && (
                    <Text style={styles.result}>Sizing Cost: {results.sizingCost} ₹</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weaving Cost Calculation</Text>
                <Text style={styles.label}>Job Work Rate</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('jobWorkRate', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateWeavingCost}>
                    <Text style={styles.buttonText}>Calculate Weaving Cost</Text>
                </TouchableOpacity>
                {results.weavingCost !== '' && (
                    <Text style={styles.result}>Weaving Cost: {results.weavingCost} ₹</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Total Fabric Cost Calculation</Text>
                <TouchableOpacity style={styles.button} onPress={calculateTotalFabricCost}>
                    <Text style={styles.buttonText}>Calculate Total Fabric Cost</Text>
                </TouchableOpacity>
                {results.totalFabricCost !== '' && (
                    <Text style={styles.result}>Total Fabric Cost: {results.totalFabricCost} ₹</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Work Billing Calculation</Text>
                <Text style={styles.label}>Order Quantity</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('orderQuantity', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateJobWorkBilling}>
                    <Text style={styles.buttonText}>Calculate Job Work Billing</Text>
                </TouchableOpacity>
                {results.jobWorkBilling !== '' && (
                    <Text style={styles.result}>Job Work Billing: {results.jobWorkBilling} ₹</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Expected Production Calculation</Text>
                <Text style={styles.label}>Loom Speed</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('loomSpeed', value)} />

                <Text style={styles.label}>Efficiency %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('efficiency', value)} />

                <Text style={styles.label}>Time</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('time', value)} />

                <Text style={styles.label}>PPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('ppi7', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateExpectedProduction}>
                    <Text style={styles.buttonText}>Calculate Expected Production</Text>
                </TouchableOpacity>
                {results.expectedProduction !== '' && (
                    <Text style={styles.result}>Expected Production: {results.expectedProduction} meters</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Expected Time for Required Production Calculation</Text>
                <Text style={styles.label}>Order Quantity</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('orderQuantity', value)} />

                <Text style={styles.label}>Loom Speed</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('loomSpeed', value)} />

                <Text style={styles.label}>Efficiency %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('efficiency', value)} />

                <Text style={styles.label}>PPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('ppi8', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateExpectedTime}>
                    <Text style={styles.buttonText}>Calculate Expected Time</Text>
                </TouchableOpacity>
                {results.expectedTime !== '' && (
                    <Text style={styles.result}>Expected Time: {results.expectedTime} hours</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default CalculationScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color:"#003C43"
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color:"#000"
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        color:"grey"
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        color:"#000"
    },
    button: {
        backgroundColor: '#003C43',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    result: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
    },
});

