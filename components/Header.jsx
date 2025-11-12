import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
  Animated,
  Dimensions,
  Pressable,
  Modal,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../app/constants";
import { router, useNavigation } from "expo-router";
import { useAuth } from "@context/useAuth";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Button from "./Button";
import IconSVG from "./IconSVG";
import ShimmerSkeleton from "./ListSkeleton";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
const { height } = Dimensions.get("window");
import Constants from "expo-constants";
import { showToast } from "./CustomToast/ToastService";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const menuItems = [
  { icon: "home", label: "Home", route: "home" },
  { icon: "briefcase", label: "Portfolio", route: "portfolio" },
  { icon: "add-circle", label: "Buy New Service", route: "service" },
  // { icon: "time-outline", label: "History", route: "history" },
  { icon: "calculator", label: "SIP Calculator", route: "sip" },
  { icon: "person", label: "Account", route: "profile" },
  { icon: "help-circle", label: "Contact us", route: "support" },
];

const getInitials = (fullName) => {
  if (!fullName?.trim()) return "";
  const names = fullName.trim().split(/\s+/);
  return (
    names[0][0].toUpperCase() +
    (names[names.length - 1][0]?.toUpperCase() || "")
  );
};

const ProfileIcon = ({ onPress, name, isProfileLoading }) => (
  <TouchableOpacity onPress={onPress} style={styles.profileContainer}>
    <View style={styles.profileCircle}>
      {isProfileLoading ? (
        <ShimmerSkeleton height={40} width={40} radius={"50%"} />
      ) : (
        <Text style={styles.profileInitial}>{name && getInitials(name)}</Text>
      )}
    </View>
  </TouchableOpacity>
);

const NotificationItem = ({ item }) => (
  <View style={styles.notificationItem}>
    <View style={styles.notificationDot} />
    <View style={styles.notificationContent}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  </View>
);

const Header = ({
  showBackButton = false,
  backButtonText = () => {},
  webUrl = null, // optional: current webview url
  disableSidebar = false,
}) => {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isInfomodalOpen, setIsInfomodalOpen] = useState(false);
  const drawerAnimation = useState(
    new Animated.Value(Dimensions.get("window").width)
  )[0];
  const navigation = useNavigation();
  const { logout, profileData, isProfileLoading } = useAuth();
  const appDomain = "http://myapp";
  // Sample notifications data
  const notifications = [
    { id: "1", title: "Your order has been shipped", time: "5 min ago" },
    { id: "2", title: "Payment successful", time: "1 hour ago" },
    { id: "3", title: "New feature available", time: "2 hours ago" },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileDrawer) {
      closeProfileDrawer();
    }
  };

  const toggleProfileDrawer = () => {
    if (
      disableSidebar ||
      (webUrl &&
        !webUrl.startsWith(appDomain) &&
        !webUrl.startsWith(`${appDomain}/`))
    ) {
      showToast({
        type: "info",
        title: `Sidebar disabled ✋`,
        message: `${"The sidebar is disabled on this screen."}`,
      });

      return;
    }
    if (showProfileDrawer) {
      closeProfileDrawer();
    } else {
      openProfileDrawer();
    }
    if (showNotifications) {
      setShowNotifications(false);
    }
  };
  const openProfileDrawer = () => {
    setShowProfileDrawer(true);
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeProfileDrawer = () => {
    Animated.timing(drawerAnimation, {
      toValue: Dimensions.get("window").width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowProfileDrawer(false);
    });
  };
  const versionCode = "2.2.1";

//drawer band karne ke liye
  useFocusEffect(
    React.useCallback(() => {
      // Jab screen focus me aaye to drawer band karo
    closeProfileDrawer()
    }, [])
  );
  return (
    <>
      <SafeAreaView edges={[]} style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {showBackButton ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                <View>{backButtonText()}</View>
              </View>
            ) : (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
              >
                <TouchableOpacity onPress={() => setIsInfomodalOpen(true)}>
                  <View
                    style={{
                      backgroundColor: "#004B8869",
                      borderRadius: "50%",
                      height: 45,
                      width: 45,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconSVG />
                  </View>
                </TouchableOpacity>
                <Text style={styles.title}>
                  {isProfileLoading ? (
                    <ShimmerSkeleton height={23} width={180} />
                  ) : (
                    <>
                      Hi{" "}
                      <Text style={styles.highlightedName}>
                        {profileData?.name?.length > 18
                          ? `${profileData.name.slice(0, 18)}...`
                          : profileData?.name}
                      </Text>
                    </>
                  )}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.rightSection}>
            <ProfileIcon
              onPress={toggleProfileDrawer}
              name={profileData?.name}
              isProfileLoading={isProfileLoading}
            />
          </View>
        </View>

        {/* Notifications dropdown */}
        {showNotifications && (
          <View style={styles.notificationsContainer}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.notificationsTitle}>Notifications</Text>
              <Text style={styles.notificationsSubtitle}>
                You have {notifications.length} unread messages
              </Text>
            </View>
            <FlatList
              data={notifications}
              renderItem={({ item }) => <NotificationItem item={item} />}
              keyExtractor={(item) => item.id}
              style={styles.notificationsList}
            />
          </View>
        )}
      </SafeAreaView>

      {/* Profile Drawer */}
      {showProfileDrawer && (
        <Pressable style={styles.overlay} onPress={closeProfileDrawer} />
      )}

      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "70%",
          backgroundColor: "#093557ff",
          transform: [{ translateX: drawerAnimation }],
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10,
          zIndex: 1000,
        }}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={["#093658", "#052b47ff"]}
          style={{
            paddingTop: StatusBar.currentHeight + 20,
            paddingHorizontal: 20,
            paddingBottom: 25,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255,255,255,0.1)",
          }}
        >
          {/* Profile Section */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            {/* Profile Avatar with Gradient Border */}
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                padding: 2,
                marginRight: 15,
              }}
            >
              <LinearGradient
                colors={["#D36C32", "#F68F00"]}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    backgroundColor: "#2d2d44",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "600",
                      color: "#F68F00",
                    }}
                  >
                    {profileData?.name && getInitials(profileData?.name)}
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* Profile Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 4,
                }}
              >
                {profileData?.name}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#a0a0b8",
                  opacity: 0.8,
                }}
              >
                {profileData?.email?.length > 22
                  ? profileData.email.slice(0, 22) + "..."
                  : profileData?.email}
              </Text>
            </View>
          </View>

          {/* Online Status Indicator */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(76, 175, 80, 0.15)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: "flex-start",
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#4CAF50",
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#4CAF50",
                fontWeight: "500",
              }}
            >
              Online
            </Text>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <ScrollView
          contentContainerStyle={{
            paddingTop: 5,
            paddingBottom: 20, // space at bottom
            paddingHorizontal: 10,
            flexGrow: 1,
            justifyContent: "space-between",
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              paddingTop: 5,
              // alignItems: "center",
            }}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  marginHorizontal: 10,
                  marginVertical: 1,
                  borderRadius: 12,
                  backgroundColor: "transparent",
                }}
                onPress={() => {router.push(item.route);  closeProfileDrawer()} }
                activeOpacity={0.7}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 15,
                  }}
                >
                  <Ionicons name={item.icon} size={20} color="#a0a0b8" />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#ffffff",
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#a0a0b8" />
              </TouchableOpacity>
            ))}

            {/* Logout Button */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 10,
                marginHorizontal: 25,
                marginVertical: 5,
                borderRadius: 20,
                width: "160",
                backgroundColor: "#F68F00",
              }}
              onPress={() => setIsLogoutModalOpen(true)}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 15,
                }}
              >
                <MaterialIcons name="logout" size={20} color="#ffffffff" />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: "#ffffffff",
                  fontWeight: "500",
                  flex: 1,
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderTopWidth: 1,
            borderTopColor: "rgba(255,255,255,0.1)",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "#bdbdd0ff",
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            Version {versionCode}
          </Text>
        </View>
      </Animated.View>

      {/* Enhanced Logout Modal */}
      <Modal
        visible={isLogoutModalOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <BlurView
          intensity={20}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "85%",
              maxWidth: 320,
              backgroundColor: "#0b2b43ff",
              borderRadius: 20,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            {/* Modal Header */}
            <LinearGradient
              colors={["#093658", "#112637ff"]}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 18,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Confirm Logout
              </Text>
              <TouchableOpacity
                onPress={() => setIsLogoutModalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            {/* Modal Content */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 25,
                alignItems: "center",
              }}
            >
              {/* Logout Icon */}
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "rgba(244, 67, 54, 0.15)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <MaterialIcons name="logout" size={28} color="#F44336" />
              </View>

              <Text
                style={{
                  fontSize: 16,
                  color: "#ffffff",
                  fontWeight: "500",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Are you sure you want to logout?
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: "#a0a0b8",
                  textAlign: "center",
                  marginBottom: 25,
                  lineHeight: 20,
                }}
              >
                You'll need to sign in again to access your account
              </Text>

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  gap: 12,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    alignItems: "center",
                  }}
                  onPress={() => setIsLogoutModalOpen(false)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => logout()}
                  activeOpacity={0.8}
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    alignSelf: "center",
                  }}
                >
                  <LinearGradient
                    colors={["#D36C32", "#F68F00"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingVertical: 14,
                      paddingHorizontal: 30,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                      }}
                    >
                      Logout
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>

      <Modal
        visible={isInfomodalOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <BlurView
          intensity={20}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "85%",
              maxWidth: 320,
              backgroundColor: "#0b2b43ff",
              borderRadius: 20,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            {/* Modal Header */}
            <LinearGradient
              colors={["#093658", "#112637ff"]}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 18,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                PlanMoney
              </Text>
              <TouchableOpacity
                onPress={() => setIsInfomodalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            {/* Modal Content */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 25 }}>
              {[
                { label: "Company Name", value: "Econexx wealth Pvt Ltd." },
                { label: "BSE Membership No", value: "Under Process" },
                { label: "SEBI Reg No", value: "Under Process" },
                { label: "ARN Number", value: "337712" },
                { label: "Principal Officer", value: "Ovesh Khatri" },
                { label: "Email", value: "po-cio@planmoney.in / 8108181604" },
                { label: "Compliance Officer", value: "Aishwarya Shinde" },
                { label: "Email", value: "services@planmoney.in / 8108181602" },
              ].map((item, index) => (
                <View key={index} style={{ marginBottom: 12 }}>
                  {/* Label */}
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#ccc",
                      marginBottom: 2,
                    }}
                  >
                    {item.label}:
                  </Text>

                  {/* Value */}
                  <Text style={{ fontSize: 14, color: "#fff" }}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.cardColor,
    zIndex: 10,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.cardColor,

    elevation: 5,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  highlightedName: {
    color: "#FFA500",
    fontWeight: "600",
    textTransform: "capitalize",
    width: 201,
  },
  iconButton: {
    marginRight: 16,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    color: "white",
  },
  profileContainer: {
    marginLeft: 8,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#890E49",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backIcon: {
    fontSize: 20,
    color: "white",
  },
  notificationsContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 70,
    right: 10,
    width: 300,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  notificationsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationsSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  notificationsList: {
    maxHeight: 300,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#002952",
    marginTop: 6,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  notificationTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  profileDrawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "white",
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerHeader: {
    padding: 24,
    backgroundColor: COLORS.cardColor,
  },
  drawerProfileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 40 : 20,
  },
  drawerProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7a1ea1",
    justifyContent: "center",
    alignItems: "center",
  },
  drawerProfileInitial: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  drawerProfileInfo: {
    marginLeft: 16,
  },
  drawerProfileName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerProfileEmail: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 4,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: COLORS.cardColor,
    opacity: 0.9,
  },
  drawerItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1f68a1",
  },
  drawerItemText: {
    fontSize: 16,
    color: COLORS.fontWhite,
    paddingHorizontal: 20,
  },
  backButton: {
    zIndex: 10,
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: COLORS.cardColor,
    borderRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: 20,
    width: "90%",
    marginHorizontal: "auto",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Header;
