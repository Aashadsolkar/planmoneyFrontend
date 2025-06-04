import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  FlatList,
  Animated,
  Dimensions,
  Pressable,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { router, useNavigation } from 'expo-router';
import { useAuth } from '../context/useAuth';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
const { height } = Dimensions.get("window")
// Icons - you'll need to install a library like react-native-vector-icons
// or use your own image assets
const BellIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.icon}>🔔</Text>
  </View>
);

const getInitials = (fullName) => {
  if (!fullName?.trim()) return "";
  const names = fullName.trim().split(/\s+/);
  return names[0][0].toUpperCase() + (names[names.length - 1][0]?.toUpperCase() || "");
};


const ProfileIcon = ({ onPress, name }) => (
  <TouchableOpacity onPress={onPress} style={styles.profileContainer}>
    <View style={styles.profileCircle}>
      <Text style={styles.profileInitial}>{name && getInitials(name)}</Text>
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
  backButtonText = () => { }
}) => {

  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const drawerAnimation = useState(new Animated.Value(Dimensions.get('window').width))[0];
  const navigation = useNavigation();
  const { logout, profileData } = useAuth();
  // Sample notifications data
  const notifications = [
    { id: '1', title: 'Your order has been shipped', time: '5 min ago' },
    { id: '2', title: 'Payment successful', time: '1 hour ago' },
    { id: '3', title: 'New feature available', time: '2 hours ago' },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileDrawer) {
      closeProfileDrawer();
    }
  };

  const toggleProfileDrawer = () => {
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
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowProfileDrawer(false);
    });
  };

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {showBackButton ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
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
              <Text style={styles.title}>
                Hi <Text style={styles.highlightedName}>{profileData?.name}</Text>
              </Text>
            )}
          </View>
          <View style={styles.rightSection}>
            {/* <TouchableOpacity onPress={toggleNotifications} style={styles.iconButton}>
              <BellIcon />
            </TouchableOpacity> */}
            <ProfileIcon onPress={toggleProfileDrawer} name={profileData?.name} />
          </View>
        </View>


        {/* Notifications dropdown */}
        {showNotifications && (
          <View style={styles.notificationsContainer}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.notificationsTitle}>Notifications</Text>
              <Text style={styles.notificationsSubtitle}>You have {notifications.length} unread messages</Text>
            </View>
            <FlatList
              data={notifications}
              renderItem={({ item }) => <NotificationItem item={item} />}
              keyExtractor={item => item.id}
              style={styles.notificationsList}
            />
          </View>
        )}
      </SafeAreaView>

      {/* Profile Drawer */}
      {showProfileDrawer && <Pressable style={styles.overlay} onPress={closeProfileDrawer} />}

      <Animated.View
        style={[
          styles.profileDrawer,
          {
            transform: [{ translateX: drawerAnimation }],
          },
        ]}
      >
        <View style={styles.drawerHeader}>
          <View style={styles.drawerProfileSection}>
            <View style={styles.drawerProfileImage}>
              <Text style={styles.drawerProfileInitial}>{profileData?.name && getInitials(profileData?.name)}</Text>
            </View>
            <View style={styles.drawerProfileInfo}>
              <Text style={styles.drawerProfileName}>{profileData?.name}</Text>
              <Text
                style={styles.drawerProfileEmail}>{profileData?.email?.length > 20
                  ? profileData.email.slice(0, 20) + '...'
                  : profileData?.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.drawerContent}>

          <TouchableOpacity style={styles.drawerItem} onPress={() =>{ router.push("home")}}>
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => router.push("portfolio")}>
            <Text style={styles.drawerItemText}>Portfolio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => router.push("service")}>
            <Text style={styles.drawerItemText}>Buy New Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => router.push("sip")}>
            <Text style={styles.drawerItemText}>SIP Calculator</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => router.push("profile")}>
            <Text style={styles.drawerItemText}>Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => setIsLogoutModalOpen(true)}>
            <Text  style={styles.drawerItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={isLogoutModalOpen} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Logout ?</Text>
                <TouchableOpacity onPress={() => setIsLogoutModalOpen(false)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={{ padding: 20, flexDirection: "column", justifyContent: "center" }}>
                <Text style={{ fontSize: 16, color: COLORS.fontWhite, fontWeight: 600, marginBottom: 20, textAlign: "center" }}>Are you sure you want to logout?</Text>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <Button onClick={() => setIsLogoutModalOpen(false)} label={"cancel"} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ width: 100, marginRight: 10 }} />
                  <Button onClick={() => logout()} label={"Logout"} gradientColor={['#D36C32', '#F68F00']} buttonStye={{ width: 100 }} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.cardColor,
    zIndex: 10,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.cardColor,

    elevation: 5
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  highlightedName: {
    color: '#FFA500',
    fontWeight: '600',
    textTransform: "capitalize"
  },
  iconButton: {
    marginRight: 16,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: 'white',
  },
  profileContainer: {
    marginLeft: 8,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7a1ea1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backIcon: {
    fontSize: 20,
    color: 'white',
  },
  notificationsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 70,
    right: 10,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  notificationsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  notificationsList: {
    maxHeight: 300,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#002952',
    marginTop: 6,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  profileDrawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '70%',
    // height: '100%',
    backgroundColor: 'white',
    zIndex: 1001,
    shadowColor: '#000',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
  },
  drawerProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7a1ea1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerProfileInitial: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerProfileInfo: {
    marginLeft: 16,
  },
  drawerProfileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerProfileEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  drawerContent: {
    // padding: 16,
    flex: 1,
    backgroundColor: COLORS.cardColor,
    opacity: 0.9,
  },
  drawerItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 16,
    color: COLORS.fontWhite,
    paddingHorizontal: 20

  },
  backButton: {
    zIndex: 10,
    width: 30,
    height: 30,
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
    marginHorizontal: "auto"
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