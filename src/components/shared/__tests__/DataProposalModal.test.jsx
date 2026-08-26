import { describe, it, expect } from 'vitest';
import DataProposalModal from '../DataProposalModal';


describe('DataProposalModal', () => {
  describe('module', () => {
    it('should export DataProposalModal component', () => {
      expect(DataProposalModal).toBeDefined();
      expect(typeof DataProposalModal).toBe('function');
    });
  });
});
