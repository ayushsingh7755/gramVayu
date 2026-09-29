import React from 'react';
import { OfficerWeatherPage } from '../officer/OfficerWeatherPage';
import { AdvisoriesPage } from '../farmer/AdvisoriesPage';
import { AlertsPage } from '../farmer/AlertsPage';
import { AnalyticsPage } from '../farmer/AnalyticsPage';

export const AdminWeatherPage = () => <OfficerWeatherPage />;
export const AdminAdvisoriesPage = () => <AdvisoriesPage />;
export const AdminAlertsPage = () => <AlertsPage />;
export const AdminAnalyticsPage = () => <AnalyticsPage />;
