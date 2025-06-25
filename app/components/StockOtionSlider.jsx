import React from 'react';
import { FlatList, Text, View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

const StockOptionSlider = ({ marketData }) => {
    const renderItem = ({ item, index }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item?.option_stock_name || ""}</Text>
            <Text style={styles.label}>Opening Price</Text>
            <Text style={styles.price}>
                {item?.start_price || ""}-{item?.end_price || ""}
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
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
    );
};

export default StockOptionSlider;

const styles = StyleSheet.create({
    card: {
        padding: 20,
        backgroundColor: COLORS.cardColor,
        width: width - 220,
        borderRadius: 10,
        borderLeftWidth: 2,
        borderLeftColor: COLORS.secondaryColor,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.fontWhite,
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        color: COLORS.fontWhite,
    },
    price: {
        fontSize: 16,
        color: COLORS.fontWhite,
    },
});
