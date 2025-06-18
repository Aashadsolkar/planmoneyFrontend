import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Modal } from 'react-native'
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

    const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
    const [sortKey, setSortKey] = useState('returnPercentage'); // returnPercentage, investedAmount, name
    const [sortDirection, setSortDirection] = useState('asc');
    const sortedInvestments = useMemo(() => {
        return [...investments].sort((a, b) => {
            if (sortKey === 'profitLoss') {
                // Profit first, loss later
                return sortDirection === 'desc'
                    ? a.returnAmount - b.returnAmount
                    : b.returnAmount - a.returnAmount;
            }

            if (sortKey === 'returnPercentage') {
            // Reverse logic: asc means high to low, desc means low to high
            return sortDirection === 'asc'
                ? b.returnPercentage - a.returnPercentage
                : a.returnPercentage - b.returnPercentage;
        }

            const valA = a[sortKey];
            const valB = b[sortKey];

            if (typeof valA === 'string') {
                return sortDirection === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            } else {
                return sortDirection === 'asc'
                    ? valA - valB
                    : valB - valA;
            }
        });
    }, [sortKey, sortDirection, investments]);

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
                const buyStockData = await stockAPi(token);
                const cmpRes = await getCmpStock(token);

                const cmpStocks = cmpRes.data.stocks;
                const buyData = buyStockData.data;

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
                            { color: portfolioSummary.totalReturns >= 0 ? COLORS.profitColor : COLORS.lossColor }
                        ]}>
                            {formatCurrency(portfolioSummary.totalReturns)} ({formatReturnPercentage(portfolioSummary.returnPercentage)})
                        </Text>
                    </View>
                </View>
            </View>

            {/* Investments Section */}
            <View style={styles.investmentsHeader}>
                <Text style={styles.investmentsTitle}>
                    Investments ({sortedInvestments.length})
                </Text>
                <View style={styles.dropdownWrapper}>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setSortDropdownVisible(true)}
                    >
                        <Text style={styles.dropdownText}>
                            Sort by: {
                                sortKey === 'returnPercentage' ? 'Returns %' :
                                    sortKey === 'investedAmount' ? 'Invested Amount' :
                                        sortKey === 'name' ? 'Stock A-Z' :
                                            sortKey === 'profitLoss' ? 'Share Up / Down' :
                                                ''
                            } ({sortDirection})
                        </Text>
                        {
                            sortDirection == "desc" ? <Ionicons style={{ marginLeft: 5 }} name="chevron-up" size={16} color="#aaa" /> : <Ionicons style={{ marginLeft: 5 }} name="chevron-down" size={16} color="#aaa" />
                        }
                        {/* <Ionicons style={{marginLeft: 5}} name="chevron-down" size={16} color="#aaa" /> */}
                    </TouchableOpacity>

                    <Modal visible={sortDropdownVisible} transparent animationType="fade">
                        <TouchableOpacity
                            style={styles.modalOverlay}
                            onPress={() => setSortDropdownVisible(false)}
                        >
                            <View style={styles.dropdownMenu}>
                                {[
                                    { key: 'returnPercentage', label: 'Returns %' },
                                    { key: 'investedAmount', label: 'Invested Amount' },
                                    { key: 'name', label: 'Stock A-Z' },
                                    { key: 'profitLoss', label: 'Profit / Loss' }, // ➕ NEW
                                ].map(item => (
                                    <TouchableOpacity
                                        key={item.key}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            if (sortKey === item.key) {
                                                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                                            } else {
                                                setSortKey(item.key);
                                                setSortDirection('desc');
                                            }
                                            setSortDropdownVisible(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>
                                            {item.label} ({sortKey === item.key ? sortDirection : 'desc'})
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
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
                                    { color: investment.returnPercentage >= 0 ? COLORS.profitColor : COLORS.lossColor }
                                ]}>
                                    {formatCurrency(investment.currentValue)}
                                </Text>
                                {/* <Text style={styles.investmentDate}>{investment.date}</Text> */}
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
                                    { color: investment.returnPercentage >= 0 ? COLORS.profitColor : COLORS.lossColor }
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
        color: COLORS.profitColor,
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
    dropdownWrapper: {
        paddingHorizontal: 16,
        marginTop: 12,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: {
        fontSize: 12,
        color: COLORS.fontWhite,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownMenu: {
        backgroundColor: COLORS.cardColor,
        borderRadius: 10,
        padding: 12,
        width: 220,
        elevation: 4,
    },
    dropdownItem: {
        paddingVertical: 10,
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#fff',
    },


})

export default PortfolioTab