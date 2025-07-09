import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../context/useAuth";
import { verifyKYCApi } from "../utils/apiCaller";
import { COLORS } from "../constants";
import Header from "../components/Header";
import Button from "../components/Button";
import { CheckCircle } from "lucide-react-native";
import { Image } from "expo-image";

export default function VerifySuccess() {
  const { txnId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { token, digiLockerRequestId } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Block back navigation
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    ); // Block Android hardware back

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation]);

  useEffect(() => {
    const verifyRequest = async () => {
      try {
        const payload = { request_id: digiLockerRequestId };
        const response = await verifyKYCApi(token, payload);
        setResult(response);
      } catch (err) {
        setError(err.message || "Something went wrong...");
      } finally {
        setLoading(false);
      }
    };

    verifyRequest();
  }, []);

  const renderIcon = () => {
    if (result?.data?.transaction_status?.toUpperCase() == "SUCCESS") {
      return (
        <CheckCircle
          style={{ marginBottom: 10 }}
          color={COLORS.profitColor}
          size={80}
        />
      );
    }
    return (
      <Image
        source={require("../../assets/images/questionCirlce.png")}
        style={{ marginBottom: 10 }}
        contentFit="cover"
        transition={500}
        cachePolicy="memory-disk"
        priority="high"
      />
    );
  };

  const getStatusColor = (status) => {
    let color = COLORS.secondaryColor;
    if (status?.toUpperCase() == "SUCCESS") {
      color = COLORS.profitColor;
    }
    return color;
  };

  const renderButton = () => {
    if (result?.data?.transaction_status?.toUpperCase() !== "SUCCESS") {
      return (
        <Button
          buttonStye={{ marginHorizontal: 20 }}
          onClick={() => {
            router.push("forms/kyc");
          }}
          label={"Try Again"}
          gradientColor={["#D36C32", "#F68F00"]}
        />
      );
    }
    return (
      <Button
        buttonStye={{ marginHorizontal: 20 }}
        onClick={() => {
          router.push("home");
        }}
        label={"Done"}
        gradientColor={["#D36C32", "#F68F00"]}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      {loading && (
        <ActivityIndicator
          style={{ marginTop: 80, marginBottom: 20 }}
          size="large"
          color="#007bff"
        />
      )}

      {error && (
        <>
          <View style={styles.card}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
          <Button
            buttonStye={{ marginHorizontal: 20 }}
            onClick={() => {
              router.push("forms/kyc");
            }}
            label={"Try Again"}
            gradientColor={["#D36C32", "#F68F00"]}
          />
        </>
      )}
      {result && (
        <View style={styles.card}>
          {renderIcon()}
          <Text style={styles.successText}>{result.message}</Text>
          <Text style={[styles.label]}>
            Transaction Status:{" "}
            <Text
              style={{ color: getStatusColor(result.data?.transaction_status) }}
            >
              {result.data?.transaction_status}
            </Text>
          </Text>
          <Text style={styles.label}>Purpose: {result.data?.purpose}</Text>
          <Text style={styles.label}>Id: {result.data?.id}</Text>
        </View>
      )}
      {!loading && renderButton()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryColor,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.fontWhite,
  },
  txnText: {
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.fontWhite,
  },
  card: {
    backgroundColor: COLORS.cardColor,
    marginTop: 80,
    paddingVertical: 40,
    padding: 18,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    marginHorizontal: 50,
    alignItems: "center",
  },
  successText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.profitColor,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.lossColor,
  },
  label: {
    fontWeight: "600",
    color: COLORS.fontWhite,
  },
});
