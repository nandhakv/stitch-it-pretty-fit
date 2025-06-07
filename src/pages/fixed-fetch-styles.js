  // Fetch styles from API
  const fetchStyles = async () => {
    setLoading(true);
    try {
      // Use the API service to fetch styles
      if (!serviceId) {
        throw new Error('Service ID is required');
      }
      
      const options = {
        // Apply filters here
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        sort: sortBy
      };
      
      // If we're in boutique-first flow, include boutiqueId
      if (boutiqueId) {
        options.boutiqueId = boutiqueId;
      }
      
      const response = await getPredesignedStyles(serviceId, options);
      
      // Update filter options from API response
      if (response.filters) {
        // Update categories/style types from API
        if (response.filters.categories && response.filters.categories.length > 0) {
          setStyleTypes(response.filters.categories);
        }
        
        // Update price range from API if available
        if (response.filters.priceRange) {
          const apiMin = response.filters.priceRange.min;
          const apiMax = response.filters.priceRange.max;
          setApiPriceRange([apiMin, apiMax]);
          
          // Only update the price range slider if it's still at the default values
          if (priceRange[0] === 0 && priceRange[1] === 3000) {
            setPriceRange([apiMin, apiMax]);
          }
        }
        
        // Extract neck types from available styles if not explicitly provided
        const neckTypesSet = new Set();
        response.styles.forEach(style => {
          if (style.customizationCategories.includes('collar')) {
            neckTypesSet.add('Round');
            neckTypesSet.add('V-Shape');
            neckTypesSet.add('Sweetheart');
            neckTypesSet.add('Deep U');
            neckTypesSet.add('Boat Neck');
            neckTypesSet.add('Keyhole');
          }
        });
        
        if (neckTypesSet.size > 0) {
          setNeckTypes(Array.from(neckTypesSet));
        }
      }
      
      // Convert API response to PredesignedStyle format for compatibility
      const apiStyles = response.styles.map(style => ({
        id: style.id,
        name: style.name,
        imageUrl: style.thumbnail || style.imageUrls[0],
        price: style.price,
        configurations: {
          frontNeck: style.customizationCategories.includes('collar') ? 'Round' : '',
          backNeck: style.customizationCategories.includes('collar') ? 'V-Shape' : '',
          embroidery: style.customizationCategories.includes('embroidery') ? 'Floral' : '',
          blouseType: style.category
        }
      }));
      
      // If no styles were found from API, fallback to sample data for dev purposes
      if (apiStyles.length === 0) {
        const sampleStyles = [
          {
            id: "style2",
            name: "Modern Cut",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse2.jpg?alt=media",
            price: 1499,
            configurations: {
              frontNeck: "Sweetheart",
              backNeck: "U-Shape",
              embroidery: "None",
              blouseType: "Sleeveless"
            }
          },
          {
            id: "style3",
            name: "Traditional Elegance",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse3.jpg?alt=media",
            price: 1899,
            configurations: {
              frontNeck: "Deep U",
              backNeck: "Boat Neck",
              embroidery: "Mirror Work",
              blouseType: "Full Sleeve"
            }
          }
        ];
        setStyles(sampleStyles);
      } else {
        setStyles(apiStyles);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching styles:', error);
      // Fallback to sample data in case of error
      const fallbackStyles = [
        {
          id: "style4",
          name: "Minimalist Chic",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse4.jpg?alt=media",
          price: 1299,
          configurations: {
            frontNeck: "Boat Neck",
            backNeck: "Round",
            embroidery: "None",
            blouseType: "Cap Sleeve"
          }
        }
      ];
      setStyles(fallbackStyles);
      setLoading(false);
    }
  };
