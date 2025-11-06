import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pexelsService } from '../pexelsService';
import * as api from '../api';

// Mock the API module
vi.mock('../api', () => ({
  inventoryAPI: {
    refreshImageCache: vi.fn(),
    getCacheInfo: vi.fn()
  }
}));

// Mock Image constructor for preloadImage tests
global.Image = class {
  constructor() {
    setTimeout(() => {
      this.onload && this.onload();
    }, 100);
  }
};

describe('PexelsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('refreshImageCache', () => {
    it('should refresh image cache successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Image cache cleared successfully',
        cacheSize: 0
      };

      api.inventoryAPI.refreshImageCache.mockResolvedValue({ data: mockResponse });

      const result = await pexelsService.refreshImageCache();

      expect(api.inventoryAPI.refreshImageCache).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle refresh cache error', async () => {
      const mockError = new Error('Network error');
      api.inventoryAPI.refreshImageCache.mockRejectedValue(mockError);

      await expect(pexelsService.refreshImageCache()).rejects.toThrow('Network error');
      expect(api.inventoryAPI.refreshImageCache).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCacheInfo', () => {
    it('should get cache info successfully', async () => {
      const mockResponse = {
        cacheSize: 25,
        message: 'Image cache information retrieved successfully'
      };

      api.inventoryAPI.getCacheInfo.mockResolvedValue({ data: mockResponse });

      const result = await pexelsService.getCacheInfo();

      expect(api.inventoryAPI.getCacheInfo).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle get cache info error', async () => {
      const mockError = new Error('API error');
      api.inventoryAPI.getCacheInfo.mockRejectedValue(mockError);

      await expect(pexelsService.getCacheInfo()).rejects.toThrow('API error');
      expect(api.inventoryAPI.getCacheInfo).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleImageError', () => {
    it('should set fallback image for fruits category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'fruits');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400');
    });

    it('should set fallback image for vegetables category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'vegetables');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400');
    });

    it('should set fallback image for dairy category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'dairy');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400');
    });

    it('should set fallback image for bakery category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'bakery');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400');
    });

    it('should set fallback image for grains category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'grains');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400');
    });

    it('should set fallback image for beverages category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'beverages');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400');
    });

    it('should set fallback image for snacks category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'snacks');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400');
    });

    it('should set fallback image for meat category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'meat');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400');
    });

    it('should set fallback image for seafood category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'seafood');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400');
    });

    it('should set fallback image for spices category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'spices');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400');
    });

    it('should set general fallback image for unknown category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'unknown');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1542838132-92c53300491e?w=400');
    });

    it('should handle case-insensitive category matching', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, 'FRUITS');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400');
    });

    it('should handle undefined category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, undefined);

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1542838132-92c53300491e?w=400');
    });

    it('should handle null category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, null);

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1542838132-92c53300491e?w=400');
    });

    it('should handle empty string category', () => {
      const mockEvent = {
        target: { src: '' }
      };

      pexelsService.handleImageError(mockEvent, '');

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1542838132-92c53300491e?w=400');
    });
  });

  describe('preloadImage', () => {
    it('should preload image successfully', async () => {
      const imageUrl = 'https://example.com/image.jpg';

      const result = await pexelsService.preloadImage(imageUrl);

      expect(result).toBeInstanceOf(Image);
    });

    it('should handle preload image error', async () => {
      // Mock Image to simulate error
      global.Image = class {
        constructor() {
          setTimeout(() => {
            this.onerror && this.onerror(new Error('Image load failed'));
          }, 100);
        }
      };

      const imageUrl = 'https://example.com/invalid-image.jpg';

      await expect(pexelsService.preloadImage(imageUrl)).rejects.toThrow();
    });

    it('should set correct src on image element', async () => {
      const imageUrl = 'https://example.com/test-image.jpg';
      let capturedSrc;

      global.Image = class {
        constructor() {
          setTimeout(() => {
            capturedSrc = this.src;
            this.onload && this.onload();
          }, 100);
        }
        set src(value) {
          this._src = value;
        }
        get src() {
          return this._src;
        }
      };

      await pexelsService.preloadImage(imageUrl);

      expect(capturedSrc).toBe(imageUrl);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle API timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'TIMEOUT';
      
      api.inventoryAPI.refreshImageCache.mockRejectedValue(timeoutError);

      await expect(pexelsService.refreshImageCache()).rejects.toThrow('Request timeout');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network unavailable');
      networkError.code = 'NETWORK_ERROR';
      
      api.inventoryAPI.getCacheInfo.mockRejectedValue(networkError);

      await expect(pexelsService.getCacheInfo()).rejects.toThrow('Network unavailable');
    });

    it('should handle malformed API responses', async () => {
      api.inventoryAPI.getCacheInfo.mockResolvedValue({ data: null });

      const result = await pexelsService.getCacheInfo();

      expect(result).toBeNull();
    });

    it('should handle missing event target in handleImageError', () => {
      const mockEvent = {};

      // Should not throw error
      expect(() => {
        pexelsService.handleImageError(mockEvent, 'fruits');
      }).not.toThrow();
    });

    it('should handle event with null target in handleImageError', () => {
      const mockEvent = { target: null };

      // Should not throw error
      expect(() => {
        pexelsService.handleImageError(mockEvent, 'fruits');
      }).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple concurrent cache operations', async () => {
      const mockResponse1 = { success: true, cacheSize: 0 };
      const mockResponse2 = { cacheSize: 5, message: 'Cache info' };

      api.inventoryAPI.refreshImageCache.mockResolvedValue({ data: mockResponse1 });
      api.inventoryAPI.getCacheInfo.mockResolvedValue({ data: mockResponse2 });

      const [refreshResult, infoResult] = await Promise.all([
        pexelsService.refreshImageCache(),
        pexelsService.getCacheInfo()
      ]);

      expect(refreshResult).toEqual(mockResponse1);
      expect(infoResult).toEqual(mockResponse2);
      expect(api.inventoryAPI.refreshImageCache).toHaveBeenCalledTimes(1);
      expect(api.inventoryAPI.getCacheInfo).toHaveBeenCalledTimes(1);
    });

    it('should handle mixed success and error responses', async () => {
      const mockResponse = { success: true, cacheSize: 0 };
      const mockError = new Error('Cache info failed');

      api.inventoryAPI.refreshImageCache.mockResolvedValue({ data: mockResponse });
      api.inventoryAPI.getCacheInfo.mockRejectedValue(mockError);

      const refreshResult = await pexelsService.refreshImageCache();
      
      expect(refreshResult).toEqual(mockResponse);
      
      await expect(pexelsService.getCacheInfo()).rejects.toThrow('Cache info failed');
    });
  });
});