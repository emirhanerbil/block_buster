require('dotenv').config();
const axios = require('axios');
const Film = require('../models/filmModel') // Film modelinizi dahil edin

const getYouTubeThumbnails = async (films) => {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
  
      const filmsWithDetails = await Promise.all(films.map(async (film) => {
        if (film.trailerUrl) {
          const videoId = film.trailerUrl.split('youtu.be/')[1].split('?')[0];
          const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`;
          
          const response = await axios.get(apiUrl);
          const videoDetails = response.data.items[0];
          if (!videoDetails) throw new Error('Video not found');
  
          const thumbnailUrl = videoDetails.snippet.thumbnails.high.url; // Yüksek çözünürlüklü thumbnail URL'si
          const embedUrl = 'https://www.youtube.com/embed/' + videoId;
  
          // ISO 8601 formatındaki süreyi okunabilir formata çevirme
          const duration = videoDetails.contentDetails.duration;
          const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
          const hours = parseInt(match[1]) || 0;
          const minutes = parseInt(match[2]) || 0;
          const seconds = parseInt(match[3]) || 0;
          
          // Süreyi HH:MM:SS veya MM:SS formatında ayarla
          let readableDuration = '';
          if (hours > 0) {
            readableDuration += `${hours}:`;
          }
          readableDuration += `${minutes.toString().padStart(2, '0')}:`;
          readableDuration += `${seconds.toString().padStart(2, '0')}`;
  
          return { 
            ...film.toObject(), 
            thumbnailUrl, 
            embedUrl, 
            duration: readableDuration 
          };
        }
        return { 
          ...film.toObject(), 
          embedUrl: '', 
          thumbnailUrl: '', 
          duration: '' 
        };
      }));
  
      return filmsWithDetails;
    } catch (error) {
      console.error('Error fetching video details:', error.message);
      return [];
    }
  };
  


module.exports = {
    getYouTubeThumbnails
  };