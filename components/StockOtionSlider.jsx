import React from 'react';
import { FlatList, Text, View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants.js';
import { formatIndianNumber } from '../utils/commonFunctions';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2; // 20 padding on both sides + 10 gap = 50

const StockOptionSlider = ({ marketData }) => {
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item?.option_stock_name || ""}</Text>
            <Text style={styles.label}>Opening Price</Text>
            <Text style={styles.price}>
                {formatIndianNumber(item?.start_price) || ""} - {formatIndianNumber(item?.end_price) || ""}
            </Text>
        </View>
    );

    return (
        <FlatList
            data={marketData}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
    );
};

export default StockOptionSlider;

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 18,
        paddingVertical:8,
    },
    card: {
        width: CARD_WIDTH,
        padding: 16,
        backgroundColor: COLORS.cardColor,
        borderRadius: 12,
        borderLeftWidth: 0.7,
        borderBottomWidth:0.4,
        borderBottomColor:COLORS.secondaryColor,
        borderLeftColor: COLORS.secondaryColor,
        boxShadow: COLORS.boxShadow,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.fontWhite,
        marginBottom: 6,
    },
    label: {
        fontSize: 13,
        color: COLORS.fontWhite,
    },
    price: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.fontWhite,
        marginTop: 4,
    },
});
