import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GoalProgressCard } from '@/components/dashboard/GoalProgressCard';
import { QuickActions } from '@/components/dashboard/QuickActions';

describe('UI Component Library & Dashboard Components', () => {
  describe('Button Component', () => {
    it('renders with children and handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const btn = screen.getByRole('button', { name: /click me/i });
      expect(btn).toBeInTheDocument();

      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders disabled button correctly', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);

      const btn = screen.getByRole('button', { name: /disabled/i });
      expect(btn).toBeDisabled();

      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies SOS variant styling correctly', () => {
      render(<Button variant="sos">Emergency SOS</Button>);
      const btn = screen.getByRole('button', { name: /emergency sos/i });
      expect(btn.className).toContain('bg-rose-600');
    });
  });

  describe('Card Component', () => {
    it('renders card with header, title, and content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Shift Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Net Pay: ₹1450</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Shift Summary')).toBeInTheDocument();
      expect(screen.getByText('Net Pay: ₹1450')).toBeInTheDocument();
    });
  });

  describe('GoalProgressCard Component', () => {
    it('renders goal progress and remaining amount', () => {
      render(
        <GoalProgressCard
          monthlyGoal={20000}
          currentMonthlyEarnings={10000}
          dailyGoal={1000}
          todayEarnings={500}
          currentLanguage="en"
        />
      );

      expect(screen.getByText(/Income Goal Progress/i)).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText(/Daily Target/i)).toBeInTheDocument();
      expect(screen.getByText(/Monthly Target/i)).toBeInTheDocument();
    });

    it('renders achieved status badge when goal met', () => {
      render(
        <GoalProgressCard
          monthlyGoal={25000}
          currentMonthlyEarnings={30000}
          dailyGoal={1000}
          todayEarnings={1200}
          currentLanguage="en"
        />
      );

      expect(screen.getByText('120%')).toBeInTheDocument();
      expect(screen.getByText(/Achieved!/i)).toBeInTheDocument();
    });
  });

  describe('QuickActions Component', () => {
    it('renders 4 quick action buttons and handles onOpenAddModal', () => {
      const handleOpenModal = vi.fn();
      render(
        <QuickActions
          currentLanguage="en"
          onOpenAddModal={handleOpenModal}
        />
      );

      const addShiftBtn = screen.getByText(/\+ Add Earning Record/i);
      expect(addShiftBtn).toBeInTheDocument();

      fireEvent.click(addShiftBtn);
      expect(handleOpenModal).toHaveBeenCalledTimes(1);

      expect(screen.getByText(/Ask AI Assistant/i)).toBeInTheDocument();
      expect(screen.getByText(/Check Welfare Schemes/i)).toBeInTheDocument();
      expect(screen.getByText(/Draft Grievance/i)).toBeInTheDocument();
    });
  });
});
