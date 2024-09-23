import React from 'react';
import { Button, Linking, Alert } from 'react-native';

const OpenBrowserExample = () => {
  const openURL = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Can't open this URL");
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <Button
      title="Open Browser"
      onPress={() => openURL('https://www.google.com')}
    />
  );
};

export default OpenBrowserExample;
