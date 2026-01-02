/**
 * StatsCard Component
 * Dashboard statistics card with icon, value, and trend
 */

import { Card, Statistic, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { colors } from '@/theme/themeConfig';
import './StatsCard.css';

const StatsCard = ({
  title,
  value,
  icon,
  color = colors.primary,
  trend,
  trendValue,
  suffix,
  prefix,
  loading = false,
  onClick,
  tooltip,
  className = '',
}) => {
  const trendColor = trend === 'up' ? colors.success : '#EF4444';
  const TrendIcon = trend === 'up' ? ArrowUpOutlined : ArrowDownOutlined;

  const cardContent = (
    <Card
      className={`stats-card ${onClick ? 'clickable' : ''} ${className}`}
      loading={loading}
      onClick={onClick}
      hoverable={!!onClick}
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="stats-card-content">
        <div className="stats-info">
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ 
              color: colors.text?.primary,
              fontWeight: 700,
              fontSize: 28,
            }}
          />
          
          {trend && trendValue && (
            <div className="stats-trend" style={{ color: trendColor }}>
              <TrendIcon />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div 
            className="stats-icon"
            style={{ 
              background: `${color}15`,
              color: color,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
};

export default StatsCard;
