import React, { useState, useRef, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	FlatList,
	SafeAreaView,
	ActivityIndicator
} from 'react-native';
import {
	Ionicons,
	MaterialCommunityIcons,
	FontAwesome5,
	AntDesign,
	Feather
} from '@expo/vector-icons';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';
import { useAuth } from '../auth/useAuth';
import { customerService, service } from '../utils/apiCaller';
import { useNavigation } from 'expo-router';
import Button from '../components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Tabs from '../components/Tabs';

const { width } = Dimensions.get('window');

export default function Home() {
	const { token, setPurchesService, purchesService, skipServices, allServices, setServiceSelectedOnHomePage,setCustomerServiceData } = useAuth();
	const [activeAccordion, setActiveAccordion] = useState(null);
	const navigation = useNavigation();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getCustomerServiceAPi = async () => {
			try {
				const response = await customerService(token)
				setCustomerServiceData(response?.data)
				const filterPurchesService = response?.data?.services?.filter((service) => service.is_subscribed)
				if (filterPurchesService.length > 0) {
					if(response?.data?.kyc_status == 0){
						navigation.navigate("kyc");
					}else if(response?.data?.questionnaire_status == 0){
						navigation.navigate("form1");
					}
					setPurchesService(filterPurchesService)
				} else {
					if (!skipServices) {
						navigation.navigate("service");
					}
				}
				setIsLoading(false);
			} catch (error) {
				console.log(error);
				setIsLoading(false)

			}
		}
		getCustomerServiceAPi()
	}, [])

	// Offer carousel data
	const offerData = [
		{
			id: '1',
			title: 'PORTFOLIO MANAGEMENT SYSTEM',
			subtitle: 'Organize your Investment',
			buttonText: 'Get this Service',
			color: '#0066CC',
		},
		{
			id: '2',
			title: 'STOCK ADVISORY',
			subtitle: 'Expert Stock Picks',
			buttonText: 'Subscribe Now',
			color: '#0077DD',
		},
		{
			id: '3',
			title: 'MUTUAL FUND ANALYSIS',
			subtitle: 'Optimize your Portfolio',
			buttonText: 'Learn More',
			color: '#0088EE',
		},
	];

	// News accordion data
	const newsData = [
		{
			id: '1',
			title: 'ICICI Lombard General Insurance Q4 Results: Net profit slips 2% to Rs 510 crore',
		},
		{
			id: '2',
			title: 'Sebi cracks down on Gemini Engineering, bars promoters from markets for fund misuse',
		},
		{
			id: '3',
			title: 'RBI keeps repo rate unchanged at 6.5% for seventh consecutive time',
		},
	];

	// Render services carousel item
	const renderServiceItem = ({ item }) => {
		const is__not_subscribed = !item.is_subscribed;

		return (
			<LinearGradient
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 0 }}
				colors={is__not_subscribed ? [COLORS.cardColor, COLORS.cardColor] : ['#AF125D', '#D36C32']}
				// style={}
				style={[styles.serviceCard]}
			>
				<Text style={styles.serviceTitle}>{item?.name}</Text>
				<View style={styles.serviceInfoRow}>
				</View>
				<View style={styles.serviceFooter}>
					{
						is__not_subscribed ? <>
							<View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
								<View style={{ justifyContent: "center", paddingEnd: 20 }}>
									<Text style={{ fontSize: 10, color: COLORS.fontWhite }}>Start from</Text>
									<Text style={{ fontSize: 12, color: COLORS.fontWhite }}>$1800</Text>
								</View>
								<View style={{ flex: 1 }}>
									<Button onClick={() => {
										navigation.navigate('service'),
											setServiceSelectedOnHomePage(item.id)
									}}
										label={"subscribe now"}
										gradientColor={['#D36C32', '#F68F00']}
										buttonStye={{ padding: 10 }}

									/>
								</View>
							</View>
						</> : <>
							<View>
								<Text style={styles.updateText}>Expire On</Text>
								<Text style={styles.dateText}>{item?.subscription?.end_at}</Text>
							</View>
							<MaterialIcons onPress={() => navigation.navigate("fastlane")} name="chevron-right" size={25} color="#fff" />
						</>
					}
				</View>
			</LinearGradient>
		)
	};

	// Toggle accordion
	const toggleAccordion = (id) => {
		setActiveAccordion(activeAccordion === id ? null : id);
	};

	const renderServices = () => {
		const renderData = purchesService.length > 0 ? purchesService : allServices
		return (
			<FlatList
				data={renderData}
				renderItem={renderServiceItem}
				keyExtractor={item => item.id}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.servicesListContainer}
			/>
		)
	}

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		)
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<Header
				title="Hi Vignesh"
				showBackButton={false}
			/>

			<ScrollView style={styles.scrollView}>
				{/* Offer Carousel Section */}
				<View style={styles.carouselContainer}>
					<ScrollView
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						style={{ paddingHorizontal: 10 }}
					>
						{offerData.map((item) => (
							<View key={item.id} style={[styles.offerCard, { backgroundColor: item.color }]}>
								<TouchableOpacity style={styles.closeButton}>
									<Ionicons name="close" size={20} color="white" />
								</TouchableOpacity>
								<Text style={styles.offerSubtitle}>{item.subtitle}</Text>
								<Text style={styles.offerTitle}>{item.title}</Text>
								<TouchableOpacity style={styles.offerButton}>
									<Text style={styles.offerButtonText}>{item.buttonText}</Text>
								</TouchableOpacity>
							</View>
						))}
					</ScrollView>
				</View>


				{/* Services Section */}
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Your Services</Text>
					{renderServices()}
				</View>

				{/* Quick Links Section */}
				<View style={styles.linksContainer}>
					<TouchableOpacity style={styles.linkItem}>
						<View style={styles.linkIconContainer}>
							<Ionicons name="bulb" size={35} color="#FFA500" />
						</View>
						<Text style={styles.linkText}>Portfolio</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.linkItem}>
						<View style={styles.linkIconContainer}>
							<MaterialCommunityIcons name="wallet-outline" size={35} color="#FFA500" />
						</View>
						<Text style={styles.linkText}>Wallet</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => navigation.navigate("sip")} style={styles.linkItem}>
						<View style={styles.linkIconContainer}>
							<FontAwesome5 name="chart-bar" size={35} color="#FFA500" />
						</View>
						<Text style={styles.linkText}>SIP Calculator</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.linkItem}>
						<View style={styles.linkIconContainer}>
							<AntDesign name="trademark" size={35} color="#FFA500" />
						</View>
						<Text style={styles.linkText}>New Arrivals</Text>
					</TouchableOpacity>
				</View>

				{/* Latest News Section */}
				<View style={styles.newsContainer}>
					<View style={styles.newsHeader}>
						<Text style={styles.newsTitle}>Latest News</Text>
						<TouchableOpacity style={styles.viewMoreButton}>
							<Text style={styles.viewMoreText}>View More</Text>
							<AntDesign name="right" size={14} color="#FFA500" />
						</TouchableOpacity>
					</View>

					{/* News Accordion */}
					{newsData.map((item) => (
						<TouchableOpacity
							key={item.id}
							style={styles.accordionItem}
							onPress={() => toggleAccordion(item.id)}
						>
							<View style={styles.accordionHeader}>
								<Text style={styles.accordionTitle} numberOfLines={2}>
									{item.title}
								</Text>
								<AntDesign
									name="right"
									size={18}
									color="#FFA500"
									style={[
										styles.accordionIcon,
										activeAccordion === item.id && styles.accordionIconActive
									]}
								/>
							</View>
							{activeAccordion === item.id && (
								<View style={styles.accordionContent}>
									<Text style={styles.accordionContentText}>
										Detailed information about this news item would appear here when expanded.
									</Text>
								</View>
							)}
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
			<Tabs />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0A2647',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 15,
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerGreeting: {
		fontSize: 18,
		color: 'white',
	},
	headerName: {
		fontSize: 18,
		color: '#FFA500',
		fontWeight: 'bold',
	},
	headerRight: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	notificationButton: {
		marginRight: 15,
		position: 'relative',
	},
	notificationBadge: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#FFA500',
	},
	avatarContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#8B008B',
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 14,
	},
	scrollView: {
		flex: 1,
		paddingTop: 80
	},
	carouselContainer: {
		marginVertical: 10,
	},
	offerCard: {
		height: 177,
		width: 335,
		borderRadius: 10,
		padding: 20,
		marginHorizontal: 10,
		position: 'relative',
	},
	closeButton: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 1,
	},
	offerSubtitle: {
		color: 'white',
		fontSize: 14,
		marginBottom: 5,
	},
	offerTitle: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	offerButton: {
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		paddingVertical: 8,
		paddingHorizontal: 15,
		borderRadius: 20,
		alignSelf: 'flex-start',
	},
	offerButtonText: {
		color: 'white',
		fontWeight: '500',
	},
	sectionContainer: {
		marginTop: 20,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
	},
	servicesListContainer: {
		paddingRight: 20,
	},
	serviceCard: {
		width: 250,
		height: 150,
		borderRadius: 10,
		padding: 15,
		marginRight: 15,
	},
	serviceTitle: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	serviceInfoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
	},
	updateContainer: {
		borderRadius: 12,
		marginRight: 8,
	},
	updateText: {
		color: 'white',
		fontSize: 12,
	},
	dateText: {
		color: 'white',
		fontSize: 12,
	},
	serviceFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: "auto"
	},
	updateDateText: {
		color: 'white',
		fontSize: 12,
		fontWeight: 500
	},
	linksContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 30,
		marginTop: 30,
		marginBottom: 20,
	},
	linkItem: {
		alignItems: 'center',
	},
	linkIconContainer: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 5,
	},
	linkText: {
		color: 'white',
		fontSize: 12,
	},
	newsContainer: {
		paddingHorizontal: 20,
		marginBottom: 30,
	},
	newsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	newsTitle: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	viewMoreButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	viewMoreText: {
		color: '#FFA500',
		fontSize: 14,
		marginRight: 5,
	},
	accordionItem: {
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		borderRadius: 10,
		marginBottom: 10,
		overflow: 'hidden',
	},
	accordionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 15,
	},
	accordionTitle: {
		color: 'white',
		fontSize: 14,
		flex: 1,
		paddingRight: 10,
	},
	accordionIcon: {
		transform: [{ rotate: '0deg' }],
	},
	accordionIconActive: {
		transform: [{ rotate: '90deg' }],
	},
	accordionContent: {
		padding: 15,
		paddingTop: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.03)',
	},
	accordionContentText: {
		color: '#CCC',
		fontSize: 14,
	},
});