import { View} from "react-native";
import  { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Asset from 'expo-asset';

export default function HtmlViewer() {
  const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    const loadHtml = async () => {
      const asset = Asset.Asset.fromModule(require('../../assets/custom-screen.html'));
      await asset.downloadAsync();
      const fileUri = asset.localUri || asset.uri;
      const content = await FileSystem.readAsStringAsync(fileUri);
      setHtmlContent(content);
    };

    loadHtml();
  }, []);

  if (!htmlContent) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    
       <WebView
         originWhitelist={['*']}
         source={{ html: htmlContent }}
       />
  );
}
