import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants";
import { getFastlaneData } from "../../utils/apiCaller";
import { useAuth } from "../../context/useAuth";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import FullScreenLoader from "../../components/FullScreenLoader";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { Image } from "expo-image";
const PmsAndQuantom = () => {
  const { token, customerServiceData, setReportData } = useAuth();
  const {} = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [fastlaneData, setFastlaneData] = useState([]);
  const navigation = useNavigation();
  const { id, advisor_name, advisor_nummber, is_advisor_assign } =
    useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      const callFastlaneApi = async () => {
        try {
          setIsLoading(true);
          const response = await getFastlaneData(token, id);
          const data = response?.data?.services;
          const sortedData = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setFastlaneData(sortedData);
        } catch (error) {
          Alert.alert("Error", error?.message || "Failed to get service data", [
            {
              text: "OK",
              onPress: () => router.push("home"),
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      };
      if (
        customerServiceData?.questionnaire_status == 1 &&
        customerServiceData?.verification_status == 1 &&
        is_advisor_assign == "true"
      ) {
        callFastlaneApi();
      }
    }, [id])
  );

  const handleBuyButtonClick = (data) => {
    let path = "";
    if (id == 2) {
      path = "/buy_stock_pis";
    } else if (id == 3) {
      path = "/buy_stock_pms";
    } else {
      path = "/buy_stock_quantom";
    }
    router.push({
      pathname: path,
      params: {
        stockId: data?.stock_id,
        serviceID: id,
        type: "BUY",
        price: data?.buy_price,
        name: data?.stock?.name,
      },
    });
  };

  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      buy: COLORS.secondaryColor, // green
      sell: COLORS.profitColor, // yellow
      hold: COLORS.lossColor, // red
    };

    return colors[riskLevel.toLowerCase()] || "#6c757d"; // fallback: gray
  };

  const getRiskLevellabel = (riskLevel) => {
    const label = {
      buy: "BUY",
      hold: "HOLD",
      sell: "SELL",
    };

    return label[riskLevel.toLowerCase()]; // fallback: gray
  };

  const renderCardList = (data) => {
    if (fastlaneData.length == 0) {
      return (
        <View style={styles.content}>
          <Animatable.View
            animation="bounceInDown"
            delay={300}
            duration={1000}
            useNativeDriver
          >
            <Entypo
              name="new"
              size={100}
              color={COLORS.secondaryColor}
              style={{ marginBottom: 20 }}
            />
          </Animatable.View>

          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
            style={styles.text}
          >
            No Recommendations available.
          </Animatable.Text>
        </View>
      );
    }
    return fastlaneData?.map((data) => {
      const dateStr = data?.created_at;
      const date = new Date(dateStr);
      const options = { day: "2-digit", month: "short" }; // e.g., "22 May"
      const formattedDate = date.toLocaleDateString("en-GB", options);
      return (
        <View style={styles.card} key={data?.id}>
          <View style={styles.cardSections}>
            <View style={{ flexDirection: "row", gap: 3 }}>
              <View style={{ marginRight: 10 }}>
                {!data?.stock?.company_logo ? (
                  <FontAwesome size={28} name="signal" color={"white"} />
                ) : (
                  <Image
                    source={{ uri: data?.stock?.company_logo }}
                    style={{ width: 30, height: 30, borderRadius: 50 }}
                    contentFit="cover"
                    transition={500}
                    cachePolicy="memory-disk"
                    priority="high"
                  />
                )}
              </View>
              <View>
                <Text style={[styles.boldText, { fontSize: 18 }]}>
                  {data?.stock?.name || ""}
                </Text>
                {/* <Text style={styles.boldText}><Text style={styles.lightText}>CMP</Text> ₹{data?.cmp || ""} </Text> */}
              </View>
            </View>
            <View style={{ gap: 5 }}>
              <Text
                style={[
                  styles.boldText,
                  {
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    backgroundColor: getRiskLevelColor(
                      data?.recommendation_type || ""
                    ),
                    borderRadius: 5,
                    color: COLORS.fontWhite,
                    textAlign: "center",
                  },
                ]}
              >
                {getRiskLevellabel(data?.recommendation_type || "")}
              </Text>
              <Text style={[styles.lightText, { fontSize: 12 }]}>
                {formattedDate}
              </Text>
            </View>
          </View>
          <View style={styles.cardSections}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lightText}>Buy Price</Text>
              <Text style={styles.boldText}>₹{data?.buy_price || ""}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lightText}>Target</Text>
              <Text style={[styles.boldText, styles.greenText]}>
                ₹{data?.target_price || ""}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lightText}>Upside</Text>
              <Text style={[styles.boldText, styles.greenText]}>
                {data?.upside || ""}%
              </Text>
            </View>
          </View>
          <View style={[styles.cardSections]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lightText}>Stop Loss</Text>
              <Text style={[styles.boldText, styles.redText]}>
                ₹{data?.stop_loss_price || ""}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lightText}>Duration</Text>
              <Text style={styles.boldText}>
                {data?.holding_period || ""} days
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {/* <Text style={styles.lightText}>Duration</Text>
                            <Text style={styles.boldText}>{data?.holding_period || ""} days</Text> */}
            </View>
          </View>

          <View style={[styles.cardSections]}>
            <View
              style={{
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setReportData({ serviceData: data, serviceID: id });
                  router.push("fastLaneReport");
                }}
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[styles.lightText, { color: COLORS.secondaryColor }]}
                >
                  REPORT ANALYSIS
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={18}
                  color={COLORS.secondaryColor}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.buttonWrapper, { alignSelf: "flex-end" }]}
                onPress={() => handleBuyButtonClick(data)}
              >
                <Text style={styles.buttonText}>Buy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    });
  };

  if (customerServiceData?.questionnaire_status == 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.cardColor}
        />
        <Header title="Hi Vignesh" showBackButton={true} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 20, marginTop: 80 }}
        >
          <View style={{ alignItems: "center", width: "100%", marginTop: 100 }}>
            <Image
              source={require("../../../assets/images/questionCirlce.png")}
              style={styles.logo}
              contentFit="cover"
              transition={500}
              cachePolicy="memory-disk"
              priority="high"
            />
            <Text
              style={{
                fontSize: 25,
                fontWeight: 600,
                color: COLORS.fontWhite,
                paddingVertical: 20,
              }}
            >
              Oops..!
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: COLORS.fontWhite,
                paddingVertical: 20,
                textAlign: "center",
                width: 250,
              }}
            >
              Its look like you have not filled your Details after Subscription
            </Text>
          </View>
          <Button
            onClick={() => router.push("forms/totalInvestmentForm")}
            label={"PROCEED"}
            gradientColor={["#D36C32", "#F68F00"]}
            buttonStye={{ marginHorizontal: 20 }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
  if (
    customerServiceData?.verification_status == 0 ||
    is_advisor_assign == "false"
  ) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardColor }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.cardColor}
        />
        <Header title="Hi Vignesh" showBackButton={true} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{
            paddingHorizontal: 20,
            backgroundColor: COLORS.primaryColor,
          }}
        >
          <View style={{ alignItems: "center", width: "100%", marginTop: 100 }}>
            <Image
              source={require("../../../assets/images/rightCircle.png")}
              style={styles.logo}
              contentFit="cover"
              transition={500}
              cachePolicy="memory-disk"
              priority="high"
            />
            <Text
              style={{
                fontSize: 25,
                fontWeight: 600,
                color: COLORS.fontWhite,
                paddingVertical: 20,
                textAlign: "center",
                width: 220,
              }}
            >
              Your Profile is Under Verification
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: COLORS.fontWhite,
                paddingVertical: 20,
                textAlign: "center",
                width: 250,
              }}
            >
              Please wait until our Advisor Approves your Profile
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  if (isLoading) {
    return <FullScreenLoader visible={isLoading} />;
  }

  const renderHeaderText = () => {
    switch (id) {
      case "3":
        return "PMS";
      case "4":
        return "Quantum Volt";
      case "2":
        return "PIS";
      default:
        return null;
    }
  };
  const backButtonText = () => {
    return (
      <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>
        {renderHeaderText()}
      </Text>
    );
  };

  const openDialer = () => {
    const url = `tel:${advisor_nummber}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Unable to open dialer")
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardColor }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardColor} />
      <Header
        title="Hi Vignesh"
        showBackButton={true}
        backButtonText={backButtonText}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20, backgroundColor: COLORS.primaryColor }}
      >
        <TouchableOpacity
          style={{ marginVertical: 10, marginTop: 20 }}
          onPress={openDialer}
        >
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            colors={["#AF125D", "#F68F00"]}
            style={{
              padding: 15,
              borderRadius: 10,
              width: "100%",
              textAlign: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontSize: 12, color: COLORS.fontWhite }}>
                Call our Advisor
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.fontWhite,
                  fontWeight: 600,
                }}
              >
                {advisor_name}
              </Text>
            </View>
            <View>
              <Image
                source={require("../../../assets/images/phone-call.png")}
                style={styles.logo}
                contentFit="cover"
                transition={500}
                cachePolicy="memory-disk"
                priority="high"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        {fastlaneData.length > 0 && (
          <Text style={styles.heading}>Stock Recommendations</Text>
        )}
        <View style={{ marginBottom: 50 }}>{renderCardList()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    color: COLORS.fontWhite,
    fontWeight: 600,
    marginBottom: 15,
  },
  card: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: COLORS.cardColor,
    marginBottom: 20,
    borderLeftColor: COLORS.secondaryColor,
    borderLeftWidth: 3,
  },
  cardSections: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryColor,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lightText: {
    fontSize: 15,
    fontWeight: 400,
    color: COLORS.lightGray,
  },
  boldText: {
    color: COLORS.fontWhite,
    fontWeight: 700,
    fontSize: 15,
  },
  greenText: {
    color: COLORS.profitColor,
  },
  redText: {
    color: COLORS.lossColor,
  },
  font12: {
    fontSize: 12,
  },
  buttonWrapper: {
    backgroundColor: "#04B719",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.fontWhite,
    fontWeight: 600,
  },

  content: {
    flex: 1,
    marginTop: 100,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.fontWhite,
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
  },
});

export default PmsAndQuantom;
