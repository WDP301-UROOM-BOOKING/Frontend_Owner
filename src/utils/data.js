import {
  FaSwimmingPool,
  FaParking,
  FaConciergeBell,
  FaUtensils,
  FaDumbbell,
  FaShuttleVan,
  FaSpa,
  FaChalkboardTeacher,
  FaDog,
  FaHandsWash,
  FaSnowflake,
  FaTv,
  FaWineBottle,
  FaBath,
  FaCoffee,
  FaWifi,
  FaLock,
  FaLaptop,
  FaVolumeMute,
  FaHome,
} from "react-icons/fa";
import { getDistricts, getProvinces, getWards } from "vietnam-provinces";

// Import các hàm API (giả sử bạn có file này)

export const listFacilities = [
  {
    name: "Free Wi-Fi",
    icon: "FaWifi",
    description: "Free high-speed internet for guests.",
    iconTemp: FaWifi,
  },
  {
    name: "Swimming Pool",
    icon: "FaSwimmingPool",
    description: "Spacious, clean, and modern swimming pool.",
    iconTemp: FaSwimmingPool,
  },
  {
    name: "Parking Lot",
    icon: "FaParking",
    description: "Free parking available for staying guests.",
    iconTemp: FaParking,
  },
  {
    name: "24/7 Room Service",
    icon: "FaConciergeBell",
    description: "Room service available at all times.",
    iconTemp: FaConciergeBell,
  },
  {
    name: "Restaurant",
    icon: "FaUtensils",
    description: "Restaurant serving a wide variety of delicious dishes.",
    iconTemp: FaUtensils,
  },
  {
    name: "Fitness Center",
    icon: "FaDumbbell",
    description: "Gym fully equipped with modern facilities.",
    iconTemp: FaDumbbell,
  },
  {
    name: "Airport Shuttle",
    icon: "FaShuttleVan",
    description: "Convenient airport transfer service for guests.",
    iconTemp: FaShuttleVan,
  },
  {
    name: "Spa & Wellness Center",
    icon: "FaSpa",
    description: "Relaxing spa treatments and wellness options.",
    iconTemp: FaSpa,
  },
  {
    name: "Laundry Service",
    icon: "FaHandsWash",
    description: "Professional laundry and dry-cleaning service.",
    iconTemp: FaHandsWash,
  },
  {
    name: "Conference Room",
    icon: "FaChalkboardTeacher",
    description: "Spacious and well-equipped conference facilities.",
    iconTemp: FaChalkboardTeacher,
  },
  {
    name: "Pet-Friendly",
    icon: "FaDog",
    description: "Pets are welcome in designated rooms.",
    iconTemp: FaDog,
  },
  {
    name: "Mini Bar",
    icon: "FaWineBottle",
    description: "In-room mini bar with snacks and beverages.",
    iconTemp: FaWineBottle,
  },
];

export const roomFacilities = [
  {
    name: "Air Conditioning",
    description: "Provides cool and comfortable air on hot days.",
    icon: "FaSnowflake",
    iconTemp: FaSnowflake,
  },
  {
    name: "Flat-screen TV",
    description: "Enjoy your favorite shows on a high-definition screen.",
    icon: "FaTv",
    iconTemp: FaTv,
  },
  {
    name: "Mini Bar",
    description: "Snacks and beverages are available.",
    icon: "FaWineBottle",
    iconTemp: FaWineBottle,
  },
  {
    name: "Private Bathroom",
    description: "Includes shower, bathtub, and free toiletries.",
    icon: "FaBath",
    iconTemp: FaBath,
  },
  {
    name: "Coffee Maker",
    description: "Brew fresh coffee right in your room.",
    icon: "FaCoffee",
    iconTemp: FaCoffee,
  },
  {
    name: "High-speed Wi-Fi",
    description: "Fast and stable internet connection.",
    icon: "FaWifi",
    iconTemp: FaWifi,
  },
  {
    name: "In-room Safe",
    description: "Safely store valuables and important documents.",
    icon: "FaLock",
    iconTemp: FaLock,
  },
  {
    name: "Work Desk",
    description: "Convenient workspace for business travelers.",
    icon: "FaLaptop",
    iconTemp: FaLaptop,
  },
  {
    name: "Soundproofing",
    description: "Ensures a quiet and relaxing stay.",
    icon: "FaVolumeMute",
    iconTemp: FaVolumeMute,
  },
  {
    name: "Balcony",
    description: "Enjoy a private outdoor space with a beautiful view.",
    icon: "FaHome",
    iconTemp: FaHome,
  },
];

export const bedTypes = [
  {
    _id: 1,
    name: "Single Bed",
    description: "A single bed suitable for one person. Width: 90 - 130 cm.",
    bedWidth: "Width 90 - 130 cm",
  },
  {
    _id: 2,
    name: "Double Bed",
    description: "A double bed ideal for two people. Width: 131 - 150 cm.",
    bedWidth: "Width 131 - 150 cm",
  },
  {
    _id: 3,
    name: "King Bed",
    description:
      "A king-size bed for extra comfort, suitable for two or more people. Width: 151 - 180 cm.",
    bedWidth: "Width 151 - 180 cm",
  },
  {
    _id: 4,
    name: "Super King Beds",
    description:
      "Room with two large single beds, suitable for two people. Total width: 181 - 210 cm.",
    bedWidth: "Width 181 - 210 cm",
  },
];

// Transform provinces data
const transformProvinces = () => {
  try {
    const provinces = getProvinces();
    console.log('Provinces structure:', provinces); // Debug log
    
    if (Array.isArray(provinces)) {
      return provinces.map(province => ({
        value: province.name, // Sử dụng name từ API
        label: province.name
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error transforming provinces:', error);
    return [];
  }
};

// Transform districts data - group by province
const transformDistricts = () => {
  try {
    const districts = getDistricts();
    console.log('Districts structure:', districts); // Debug log
    
    const result = {};
    
    // Nếu districts trả về array với thông tin province trong mỗi district
    if (Array.isArray(districts)) {
      districts.forEach(district => {
        const provinceName = district.province_name; // Sử dụng province_name từ API
        const districtName = district.name; // Sử dụng name từ API
        
        if (!result[provinceName]) {
          result[provinceName] = [];
        }
        
        result[provinceName].push({
          value: districtName,
          label: districtName
        });
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error transforming districts:', error);
    return {};
  }
};

// Transform wards data - group by district
const transformWards = () => {
  try {
    const wards = getWards();
    console.log('Wards structure:', wards); // Debug log
    
    const result = {};
    
    // Nếu wards trả về array với thông tin district trong mỗi ward
    if (Array.isArray(wards)) {
      wards.forEach(ward => {
        const districtName = ward.district_name; // Sử dụng district_name từ API
        const wardName = ward.name; // Sử dụng name từ API
        
        if (!result[districtName]) {
          result[districtName] = [];
        }
        
        result[districtName].push({
          value: wardName,
          label: wardName
        });
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error transforming wards:', error);
    return {};
  }
};

// Export transformed data
export const cityOptionSelect = transformProvinces();
export const districtsByCity = transformDistricts();
export const wardsByDistrict = transformWards();
