import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Tabs from '../Tabs';


describe('Tabs', () => {
  describe('rendering', () => {
    it('should render tabs component', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    });

    it('should render default tab content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Tabs defaultValue="tab1" className="custom-class">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      expect(document.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('tab switching', () => {
    it('should switch tabs when trigger is clicked', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should call onChange when tab is switched', () => {
      const onChange = vi.fn();

      render(
        <Tabs defaultValue="tab1" onChange={onChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(onChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('controlled mode', () => {
    it('should work in controlled mode', () => {
      const onChange = vi.fn();

      render(
        <Tabs value="tab2" onChange={onChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
  });

  describe('Tabs.Trigger', () => {
    it('should have aria-selected for active tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false');
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2" disabled>Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeDisabled();
    });

    it('should not switch when disabled tab is clicked', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2" disabled>Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('should throw error when used outside Tabs', () => {
      expect(() => render(<Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>)).toThrow(
        'Tabs.Trigger must be used within a Tabs component'
      );
    });
  });

  describe('Tabs.Content', () => {
    it('should have role="tabpanel"', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('should throw error when used outside Tabs', () => {
      expect(() => render(<Tabs.Content value="tab1">Content</Tabs.Content>)).toThrow(
        'Tabs.Content must be used within a Tabs component'
      );
    });
  });

  describe('Tabs.List', () => {
    it('should have role="tablist"', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List className="custom-list-class">
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toHaveClass('custom-list-class');
    });
  });
});
