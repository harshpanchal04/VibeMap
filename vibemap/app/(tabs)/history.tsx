import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../src/components/ui/ScreenWrapper';
import { TripHistoryCard } from '../../src/components/TripHistoryCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../src/features/store';
import { fetchUserHistory } from '../../src/features/chat/tripSlice';
import { theme } from '../../src/theme';

export default function History() {
    const dispatch = useDispatch<AppDispatch>();
    const { history, status, error } = useSelector((state: RootState) => state.trip);

    useEffect(() => {
        dispatch(fetchUserHistory());
    }, [dispatch]);

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vibes yet. Go generate one!</Text>
        </View>
    );

    const renderFooter = () => (
        <View style={{ height: 100 }} /> // Spacer
    );

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Vibes</Text>
            </View>

            {status === 'loading' && history.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <TripHistoryCard trip={item} />}
                    ListEmptyComponent={renderEmptyState}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={status === 'loading'}
                    onRefresh={() => dispatch(fetchUserHistory())}
                />
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: 20,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        color: '#64748b',
        fontSize: 18,
        fontStyle: 'italic',
    },
});
