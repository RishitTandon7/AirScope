import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Heart, Leaf, Wind, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { getAQILevel } from '../../constants/aqi';

interface HealthDashboardProps {
  aqi: number;
}

const getHealthRecommendations = (aqi: number) => {
  const level = getAQILevel(aqi);
  
  if (aqi <= 50) {
    return {
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      title: 'Great Air Quality!',
      activities: ['Perfect for outdoor activities', 'Ideal for exercise', 'Great for children to play outside'],
      tips: ['Open windows for fresh air', 'Enjoy outdoor sports', 'Take long walks'],
    };
  } else if (aqi <= 100) {
    return {
      icon: Heart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      title: 'Moderate Conditions',
      activities: ['Generally safe for most people', 'Sensitive individuals should monitor'],
      tips: ['Reduce prolonged outdoor exertion', 'Consider indoor activities for sensitive groups'],
    };
  } else if (aqi <= 150) {
    return {
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      title: 'Unhealthy for Sensitive Groups',
      activities: ['Limit outdoor activities if sensitive', 'Children and elderly should stay indoors'],
      tips: ['Use air purifiers indoors', 'Wear N95 masks outdoors', 'Keep windows closed'],
    };
  } else {
    return {
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      title: 'Unhealthy Air Quality',
      activities: ['Avoid outdoor activities', 'Stay indoors with air filtration'],
      tips: ['Use high-quality air purifiers', 'Seal gaps in doors/windows', 'Consider relocating temporarily'],
    };
  }
};

export const HealthDashboard: React.FC<HealthDashboardProps> = ({ aqi }) => {
  const recommendations = getHealthRecommendations(aqi);
  const Icon = recommendations.icon;

  return (
    <div className="space-y-6">
      {/* Main Health Card */}
      <Card className={`${recommendations.bgColor} border-l-4 border-l-current ${recommendations.color}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${recommendations.bgColor}`}>
            <Icon className={`${recommendations.color}`} size={32} />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${recommendations.color} mb-2`}>
              {recommendations.title}
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Activities</h4>
                <ul className="space-y-1">
                  {recommendations.activities.map((activity, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                      {activity}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tips</h4>
                <ul className="space-y-1">
                  {recommendations.tips.map((tip, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (recommendations.activities.length + index) * 0.1 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Health Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <Wind className="text-blue-600" size={24} />
            <h4 className="font-semibold text-blue-800">Indoor Air Quality</h4>
          </div>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Use HEPA air purifiers</li>
            <li>• Maintain humidity 30-50%</li>
            <li>• Regular cleaning and dusting</li>
            <li>• Avoid smoking indoors</li>
          </ul>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="text-green-600" size={24} />
            <h4 className="font-semibold text-green-800">Natural Solutions</h4>
          </div>
          <ul className="space-y-2 text-sm text-green-700">
            <li>• Indoor plants (Spider plants, Snake plants)</li>
            <li>• Essential oil diffusers</li>
            <li>• Activated charcoal bags</li>
            <li>• Himalayan salt lamps</li>
          </ul>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-purple-600" size={24} />
            <h4 className="font-semibold text-purple-800">Sensitive Groups</h4>
          </div>
          <ul className="space-y-2 text-sm text-purple-700">
            <li>• Children under 14</li>
            <li>• Adults over 65</li>
            <li>• Pregnant women</li>
            <li>• People with heart/lung conditions</li>
          </ul>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-rose-100">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-rose-600" size={24} />
            <h4 className="font-semibold text-rose-800">Health Monitoring</h4>
          </div>
          <ul className="space-y-2 text-sm text-rose-700">
            <li>• Track symptoms daily</li>
            <li>• Monitor peak flow (if asthmatic)</li>
            <li>• Stay hydrated</li>
            <li>• Consult doctor if needed</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};