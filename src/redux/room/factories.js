import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api/index";

const Factories = {
  // Fetch rooms by hotel ID for owner
  fetchRoomByHotelId: async (hotelId) => {
    try {
      const response = await api.get(ApiConstants.ROOMS_BY_HOTEL_ID(hotelId));
      return response.data;
    } catch (error) {
      console.error("Error fetching rooms by hotel ID:", error);
      throw error;
    }
  },

  // Create new room
  createRoom: async (roomData) => {
    try {
      const response = await api.post("/room/create-room", roomData);
      return response.data;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  // Update existing room
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await api.put(`/room/update-room/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  },

  // Change room status
  changeRoomStatus: async (roomId, statusActive) => {
    try {
      const response = await api.put(`/room/change-status-room/${roomId}`, {
        statusActive
      });
      return response.data;
    } catch (error) {
      console.error("Error changing room status:", error);
      throw error;
    }
  },

  // Upload room images
  uploadRoomImages: async (imageFiles) => {
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.post("/room/upload_images", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading room images:", error);
      throw error;
    }
  },

  // Delete room images
  deleteRoomImages: async (imageIds) => {
    try {
      const response = await api.delete("/room/delete_images", {
        data: { imageIds }
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting room images:", error);
      throw error;
    }
  },

  // Get room details by ID
  getRoomById: async (roomId) => {
    try {
      const response = await api.get(`/room/rooms_detail/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching room details:", error);
      throw error;
    }
  }
};

export default Factories;
