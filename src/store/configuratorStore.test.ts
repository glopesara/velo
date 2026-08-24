import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateTotalPrice, 
  calculateInstallment, 
  formatPrice,
  CarConfiguration,
  useConfiguratorStore
} from './configuratorStore';

describe('configuratorStore functions', () => {
  describe('calculateTotalPrice', () => {
    it('should calculate base price correctly with aero wheels and no optionals', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: []
      };
      // BASE_PRICE is 40000
      expect(calculateTotalPrice(config)).toBe(40000);
    });

    it('should add sport wheels price', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport',
        optionals: []
      };
      // 40000 + 2000
      expect(calculateTotalPrice(config)).toBe(42000);
    });

    it('should add optionals price correctly', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: ['precision-park', 'flux-capacitor']
      };
      // 40000 + 5500 + 5000
      expect(calculateTotalPrice(config)).toBe(50500);
    });

    it('should calculate total with both sport wheels and optionals', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport',
        optionals: ['precision-park']
      };
      // 40000 + 2000 + 5500
      expect(calculateTotalPrice(config)).toBe(47500);
    });
  });

  describe('calculateInstallment', () => {
    it('should calculate the 12-month installment with 2% monthly interest correctly', () => {
      const total = 40000;
      const expected = 3782.38; 
      expect(calculateInstallment(total)).toBe(expected);
    });
  });

  describe('formatPrice', () => {
    it('should format a number as BRL currency', () => {
      const formatted = formatPrice(40000);
      // Format can use different whitespace characters (e.g. non-breaking space)
      const cleanString = formatted.replace(/[\s\u00A0\u202F]/g, '');
      expect(cleanString).toBe('R$40.000,00');
    });
  });

  describe('useConfiguratorStore', () => {
    beforeEach(() => {
      useConfiguratorStore.getState().resetConfiguration();
    });

    it('should set exterior color and update view mode to exterior', () => {
      const store = useConfiguratorStore.getState();
      store.setExteriorColor('midnight-black');
      
      const updatedStore = useConfiguratorStore.getState();
      expect(updatedStore.configuration.exteriorColor).toBe('midnight-black');
      expect(updatedStore.viewMode).toBe('exterior');
    });

    it('should set interior color and update view mode to interior', () => {
      const store = useConfiguratorStore.getState();
      store.setInteriorColor('deep-blue');
      
      const updatedStore = useConfiguratorStore.getState();
      expect(updatedStore.configuration.interiorColor).toBe('deep-blue');
      expect(updatedStore.viewMode).toBe('interior');
    });

    it('should set wheel type', () => {
      const store = useConfiguratorStore.getState();
      store.setWheelType('sport');
      
      const updatedStore = useConfiguratorStore.getState();
      expect(updatedStore.configuration.wheelType).toBe('sport');
    });

    it('should toggle optionals correctly', () => {
      const store = useConfiguratorStore.getState();
      
      // Add optional
      store.toggleOptional('precision-park');
      expect(useConfiguratorStore.getState().configuration.optionals).toContain('precision-park');
      
      // Remove optional
      store.toggleOptional('precision-park');
      expect(useConfiguratorStore.getState().configuration.optionals).not.toContain('precision-park');
    });

    it('should reset configuration to default values', () => {
      const store = useConfiguratorStore.getState();
      store.setExteriorColor('midnight-black');
      store.setWheelType('sport');
      store.toggleOptional('precision-park');
      
      store.resetConfiguration();
      
      const resetStore = useConfiguratorStore.getState();
      expect(resetStore.configuration.exteriorColor).toBe('glacier-blue');
      expect(resetStore.configuration.interiorColor).toBe('carbon-black');
      expect(resetStore.configuration.wheelType).toBe('aero');
      expect(resetStore.configuration.optionals).toEqual([]);
    });
  });
});
