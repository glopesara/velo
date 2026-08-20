import { describe, it, expect } from 'vitest';
import { 
  calculateTotalPrice, 
  calculateInstallment, 
  formatPrice,
  CarConfiguration
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
});
