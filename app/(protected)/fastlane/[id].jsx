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
import { MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import FullScreenLoader from "../../components/FullScreenLoader";
import * as Animatable from "react-native-animatable";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "expo-image";

const FastLane = () => {
  const { token, customerServiceData, setReportData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [fastlaneData, setFastlaneData] = useState([]);
  const navigation = useNavigation();
  const { id, is_advisor_assign } = useLocalSearchParams();

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
      if (customerServiceData?.questionnaire_status == 1) {
        callFastlaneApi();
      }
    }, [id])
  );

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
                <Image
                  source={{ uri: data?.stock?.company_logo }}
                  style={{ width: 30, height: 30, borderRadius: 50 }}
                  contentFit="cover"
                  transition={500}
                  cachePolicy="memory-disk"
                  priority="high"
                />
              </View>
              <View>
                <Text style={[styles.boldText, { fontSize: 18, width: 200 }]}>
                  {data?.stock?.name || "NA"}
                </Text>
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
                      data?.recommendation_type
                    ),
                    borderRadius: 5,
                    color: COLORS.fontWhite,
                    textAlign: "center",
                  },
                ]}
              >
                {getRiskLevellabel(data?.recommendation_type)}
              </Text>
              <Text style={[styles.lightText, { fontSize: 12 }]}>
                {formattedDate}
              </Text>
            </View>
          </View>
          <View style={styles.cardSections}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lightText}>Buy Price</Text>
              <Text style={styles.boldText}>₹{data?.buy_price || "NA"}</Text>
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
                ₹{data?.stop_loss_price || "NA"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lightText}>Duration</Text>
              <Text style={styles.boldText}>
                {data?.holding_period || "NA"} days
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {/* <Text style={styles.lightText}>Date of Recommendations</Text>
                            <Text style={styles.boldText}>{data?.holding_period || "NA"} days</Text> */}
            </View>
          </View>
          <View
            style={[
              styles.cardSections,
              { borderBottomColor: COLORS.cardColor },
            ]}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Text
                  onPress={() => {
                    setReportData({ serviceData: data, serviceID: id });
                    router.push("fastLaneReport");
                  }}
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
          </View>
        </View>
      );
    });
  };

  if (customerServiceData?.questionnaire_status == 0) {
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
            paddingTop: 100,
          }}
        >
          <View style={{ alignItems: "center", width: "100%" }}>
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
            onClick={() => router.push("forms/personalDetails")}
            label={"PROCEED"}
            gradientColor={["#D36C32", "#F68F00"]}
            buttonStye={{ marginHorizontal: 20 }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return <FullScreenLoader visible={isLoading} />;
  }
  const backButtonText = () => {
    return (
      <Text style={{ color: COLORS.fontWhite, fontSize: 18, fontWeight: 600 }}>
        {id == 1 ? "FastLane" : "Premium Research"}
      </Text>
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
        style={{
          paddingHorizontal: 20,
          backgroundColor: COLORS.primaryColor,
          paddingTop: 15,
        }}
      >
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
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondaryColor,
  },
  cardSections: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryColor,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center"
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

export default FastLane;
