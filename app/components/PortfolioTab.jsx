import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useAuth } from '../context/useAuth';
import { COLORS } from '../constants';
import { getCmpStock, pmsPortfolio } from '../utils/apiCaller';
import { router } from 'expo-router';

const PortfolioTab = ({ advisorName, stockAPi }) => {

    const { token } = useAuth();
    const [sortOrder, setSortOrder] = useState('asc');
    const [investments, setInvestments] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    const sortedInvestments = useMemo(() => {
        return [...investments].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.returnPercentage - b.returnPercentage
                : b.returnPercentage - a.returnPercentage;
        });
    }, [sortOrder, investments]);

    // Calculate portfolio summary
    const portfolioSummary = useMemo(() => {
        const totalReturns = investments.reduce((sum, item) => sum + item.returnAmount, 0);
        const totalInvested = investments.reduce((sum, item) => sum + item.investedAmount, 0);
        const returnPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

        return {
            currentRate: investments.reduce((sum, item) => sum + item.currentValue, 0),
            totalInvested,
            totalReturns,
            returnPercentage,
        };
    }, [investments]);

    useEffect(() => {
        const getPmsData = async () => {
            try {
                const pmsRes = await stockAPi(token);
                const cmpRes = await getCmpStock(token);

                const cmpStocks = cmpRes.data.stocks;
                const buyData = pmsRes.data;

                const merged = buyData.map(buy => {
                    const stockDetails = cmpStocks.find(stock => stock.stock_id === buy.stock_id);
                    if (!stockDetails) return null;

                    const quantity = parseFloat(buy.total_quantity);
                    const investedAmount = parseFloat(buy.total_invested);
                    const currentPrice = parseFloat(stockDetails.nse_price || stockDetails.bse_price);
                    const currentValue = quantity * currentPrice;
                    const returnAmount = currentValue - investedAmount;
                    const returnPercentage = (returnAmount / investedAmount) * 100;

                    return {
                        id: String(stockDetails.stock_id),
                        name: stockDetails.symbol,
                        quantity,
                        investedAmount,
                        currentValue,
                        buyPrice: investedAmount / quantity,
                        date: 'N/A', // Replace with actual buy date if available
                        returnPercentage,
                        returnAmount,
                    };
                }).filter(Boolean);

                setInvestments(merged);
                setIsLoading(false)
                // setTimeout(() => {
                //     let pmsRes = {}
                //     if (advisorName == "aashad") {
                //         pmsRes = {
                //             "status": "success",
                //             "message": "PMS data stored successfully.",
                //             "data": [
                //                 {
                //                     "stock_id": 1,
                //                     "total_quantity": "6",
                //                     "total_invested": "3912.00"
                //                 },
                //                 {
                //                     "stock_id": 2,
                //                     "total_quantity": "3",
                //                     "total_invested": "345.00"
                //                 }
                //             ]
                //         }
                //     } else {
                //         pmsRes = {
                //             "status": "success",
                //             "message": "PMS data stored successfully.",
                //             "data": [
                //                 {
                //                     "stock_id": 1,
                //                     "total_quantity": "10",
                //                     "total_invested": "6000.00"
                //                 },
                //                 {
                //                     "stock_id": 2,
                //                     "total_quantity": "3",
                //                     "total_invested": "345.00"
                //                 }
                //             ]
                //         }
                //     }
                //     const cmpRes = {
                //         "status": "success",
                //         "message": "All stock prices retrieved successfully.",
                //         "data": {
                //             "stocks": [
                //                 {
                //                     "stock_id": 1,
                //                     "symbol": "TATASTEEL",
                //                     "nse_price": "700.30",
                //                     "bse_price": "700.30",
                //                     "year_high": "184.60",
                //                     "year_low": "122.60"
                //                 },
                //                 {
                //                     "stock_id": 2,
                //                     "symbol": "TCS",
                //                     "nse_price": "3407.50",
                //                     "bse_price": "3405.05",
                //                     "year_high": "4513.98",
                //                     "year_low": "3060.25"
                //                 }
                //             ]
                //         }
                //     }

                //     const cmpStocks = cmpRes.data.stocks;
                //     const buyData = pmsRes.data;

                //     const merged = buyData.map(buy => {
                //         const stockDetails = cmpStocks.find(stock => stock.stock_id === buy.stock_id);
                //         if (!stockDetails) return null;

                //         const quantity = parseFloat(buy.total_quantity);
                //         const investedAmount = parseFloat(buy.total_invested);
                //         const currentPrice = parseFloat(stockDetails.nse_price || stockDetails.bse_price);
                //         const currentValue = quantity * currentPrice;
                //         const returnAmount = currentValue - investedAmount;
                //         const returnPercentage = (returnAmount / investedAmount) * 100;

                //         return {
                //             id: String(stockDetails.stock_id),
                //             name: stockDetails.symbol,
                //             quantity,
                //             investedAmount,
                //             currentValue,
                //             buyPrice: investedAmount / quantity,
                //             date: 'N/A', // Replace with actual buy date if available
                //             returnPercentage,
                //             returnAmount,
                //         };
                //     }).filter(Boolean);

                //     setInvestments(merged);
                //     setIsLoading(false)
                // }, 500);
            } catch (error) {
                Alert.alert(
                    "Error",
                    error?.message || "Portfolio Api Failed",
                    [
                        { text: "OK", onPress: () => router.push("home") },
                    ]
                );
            }
        };

        getPmsData();
    }, []);


    // Handle sort toggle
    const handleSortToggle = useCallback(() => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    }, []);

    // Format return percentage
    const formatReturnPercentage = useCallback((percentage) => {
        const sign = percentage >= 0 ? '+' : '';
        return `${sign}${percentage.toFixed(2)}%`;
    }, []);

    // Format currency
    const formatCurrency = useCallback((amount) => {
        return `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }, []);

    // Handle investment item press
    const handleInvestmentPress = useCallback((investment) => {
        Alert.alert(
            investment.name,
            `Current Value: ₹${investment.currentValue.toLocaleString()}\nReturn: ${investment.returnPercentage > 0 ? '+' : ''}${investment.returnPercentage.toFixed(2)}%`,
            [{ text: 'OK' }]
        );
    }, []);

    // Handle advisor call
    const handleAdvisorCall = useCallback(() => {
        Alert.alert(
            'Call Advisor',
            'Would you like to call Gaurav Sadvelkar?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call', onPress: () => console.log('Calling advisor...') },
            ]
        );
    }, []);

    if (isLoading) {
        return (
            <View style={styles.contentContainer}>
                <ActivityIndicator color={"#fff"} size="small" />
            </View>
        )
    }

    return (
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Main Investment Card */}
            <View style={styles.mainCard}>
                {/* Current Rate Section */}
                <View style={styles.rateSection}>
                    <Text style={styles.currentRateLabel}>Current Rate</Text>
                    <Text style={styles.currentRateValue}>
                        {formatCurrency(portfolioSummary.currentRate)}
                    </Text>
                </View>

                {/* Divider Line */}
                <View style={styles.dividerLine} />

                {/* Investment Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Invested Amt</Text>
                        <Text style={styles.summaryValue}>
                            {formatCurrency(portfolioSummary.totalInvested)}
                        </Text>
                    </View>
                    <View style={styles.dividerVertical} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Returns</Text>
                        <Text style={[
                            styles.returnsValue,
                            { color: portfolioSummary.totalReturns >= 0 ? '#10b981' : '#ef4444' }
                        ]}>
                            {formatCurrency(portfolioSummary.totalReturns)} ({formatReturnPercentage(portfolioSummary.returnPercentage)})
                        </Text>
                    </View>
                </View>
            </View>

            {/* Call Advisor Section with Enhanced Gradient */}
            {/* <TouchableOpacity style={styles.advisorCardContainer} onPress={handleAdvisorCall}>
                <LinearGradient
                    colors={['#f96c2a', '#db4646', '#a8034d']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.advisorCard}
                >
                    <View style={styles.advisorContent}>
                        <View style={styles.advisorTextContainer}>
                            <Text style={styles.advisorLabel}>Call our Advisor</Text>
                            <Text style={styles.advisorName}>{advisorName}</Text>
                        </View>
                        <View style={styles.phoneIconContainer}>
                            <Ionicons name="call" size={22} color="#fff" />
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity> 

            {/* Investments Section */}
            <View style={styles.investmentsHeader}>
                <Text style={styles.investmentsTitle}>
                    Investments ({sortedInvestments.length})
                </Text>
                <TouchableOpacity style={styles.sortContainer} onPress={handleSortToggle}>
                    <Text style={styles.sortBy}>
                        Sort By Returns % ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
                    </Text>
                    <Ionicons
                        name={sortOrder === 'asc' ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="#a0a0a0"
                        style={styles.sortIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* Investment Items */}
            {sortedInvestments.map((investment) => (
                <TouchableOpacity
                    key={investment.id}
                    style={styles.investmentItem}
                    onPress={() => handleInvestmentPress(investment)}
                >
                    <View style={styles.investmentCard}>
                        <View style={styles.investmentHeader}>
                            <View style={styles.investmentTitleContainer}>
                                <Text style={styles.investmentName}>{investment.name}</Text>
                                <Text style={styles.investmentQty}>{investment.quantity} Qty</Text>
                            </View>
                            <View style={styles.investmentValueContainer}>
                                <Text style={[
                                    styles.investmentCurrentValue,
                                    { color: investment.returnPercentage >= 0 ? '#10b981' : '#ef4444' }
                                ]}>
                                    {formatCurrency(investment.currentValue)}
                                </Text>
                                <Text style={styles.investmentDate}>{investment.date}</Text>
                            </View>
                        </View>

                        <View style={styles.investmentDivider} />

                        <View style={styles.investmentFooter}>
                            <View style={styles.investmentFooterItem}>
                                <Text style={styles.investmentFooterLabel}>Invested</Text>
                                <Text style={styles.investedAmount}>
                                    {formatCurrency(investment.investedAmount)}
                                </Text>
                            </View>
                            <View style={styles.investmentFooterItem}>
                                <Text style={styles.investmentFooterLabel}>Avg cost</Text>
                                <Text style={styles.buyAtValue}>
                                    {formatCurrency(investment.buyPrice)}
                                </Text>
                            </View>
                            <View style={styles.investmentFooterItem}>
                                <Text style={styles.investmentFooterLabel}>Return</Text>
                                <Text style={[
                                    styles.returnPercentage,
                                    { color: investment.returnPercentage >= 0 ? '#10b981' : '#ef4444' }
                                ]}>
                                    {formatReturnPercentage(investment.returnPercentage)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
        </ScrollView>
    )
};
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: COLORS.primaryColor
    },
    // Main Card Styles
    mainCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    rateSection: {
        marginBottom: 20,
    },
    currentRateLabel: {
        color: '#a0a0a0',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    currentRateValue: {
        color: '#10b981',
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: -1,
    },
    dividerLine: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginBottom: 20,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    dividerVertical: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginHorizontal: 20,
    },
    summaryLabel: {
        color: '#a0a0a0',
        fontSize: 13,
        marginBottom: 6,
        fontWeight: '500',
    },
    summaryValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    returnsValue: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    advisorCardContainer: {
        marginBottom: 25,
        borderRadius: 14,
        shadowColor: '#ff6b35',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    advisorCard: {
        borderRadius: 14,
        padding: 18,
    },
    advisorContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    advisorTextContainer: {
        flex: 1,
    },
    advisorLabel: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 4,
    },
    advisorName: {
        color: '#fff',
        fontSize: 19,
        fontWeight: '700',
    },
    phoneIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        padding: 12,
    },

    // Investments Section
    investmentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    investmentsTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    sortBy: {
        color: '#a0a0a0',
        fontSize: 8,
        fontWeight: '500',
    },
    sortIcon: {
        marginLeft: 4,
    },

    // Enhanced Investment Items
    investmentItem: {
        marginBottom: 12,
    },
    investmentCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    investmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    investmentTitleContainer: {
        flex: 1,
    },
    investmentName: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    investmentQty: {
        color: '#a0a0a0',
        fontSize: 13,
        fontWeight: '500',
    },
    investmentValueContainer: {
        alignItems: 'flex-end',
    },
    investmentCurrentValue: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 4,
    },
    investmentDate: {
        color: '#a0a0a0',
        fontSize: 13,
        fontWeight: '500',
    },
    investmentDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 12,
    },
    investmentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    investmentFooterItem: {
        flex: 1,
    },
    investmentFooterLabel: {
        color: '#a0a0a0',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    investedAmount: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    buyAtValue: {
        color: '#ff8c00',
        fontSize: 15,
        fontWeight: '600',
    },
    returnPercentage: {
        fontSize: 15,
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 20,
    },
})

export default PortfolioTab