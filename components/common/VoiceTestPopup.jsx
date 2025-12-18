import { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Upload, Play, Pause, Square, Send, CheckCircle } from 'lucide-react';

const VoiceTestPopup = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recordingSupported, setRecordingSupported] = useState(true);
  
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // MC Script content
  const mcScript = `1. GIỚI THIỆU BẢN THÂN (30 giây)
"Xin chào, tôi là [Tên của bạn], [Tuổi] tuổi, hiện đang [Nghề nghiệp/Công việc]. Tôi rất quan tâm đến việc phát triển kỹ năng MC và tin rằng Trung Tâm MC Q&K Bắc Giang sẽ giúp tôi cải thiện khả năng dẫn chương trình của mình."

2. THỂ HIỆN GIỌNG ĐỌC (1 phút)
"Đây là một đoạn văn mẫu để test giọng đọc của tôi. Tôi sẽ đọc với tốc độ vừa phải, rõ ràng và có cảm xúc. [Đọc đoạn văn dưới đây]

'Chào mừng quý vị đến với chương trình đặc biệt hôm nay. Chúng ta sẽ cùng nhau khám phá những điều thú vị và bổ ích. Hãy để tôi dẫn dắt các bạn qua hành trình tuyệt vời này.'"

3. THỂ HIỆN KHẢ NĂNG TƯƠNG TÁC (45 giây)
"Bây giờ tôi sẽ giả lập một tình huống tương tác với khán giả. Hãy tưởng tượng các bạn đang ngồi trong studio với tôi.

'Các bạn có thấy không, ánh sáng trong studio hôm nay thật tuyệt vời! Tôi có thể thấy những nụ cười rạng rỡ trên khuôn mặt mọi người. Hãy cho tôi biết, ai trong số các bạn đã từng mơ ước trở thành MC chuyên nghiệp?'"

4. KẾT THÚC (30 giây)
"Cảm ơn các bạn đã lắng nghe. Tôi hy vọng phần thể hiện này sẽ giúp Trung Tâm MC Q&K Bắc Giang đánh giá được tiềm năng của tôi. Tôi rất mong nhận được phản hồi và lộ trình phát triển phù hợp. Xin chào và hẹn gặp lại!"

LƯU Ý:
- Đọc tự nhiên, không cần học thuộc lòng
- Thể hiện cảm xúc phù hợp với nội dung
- Tốc độ vừa phải, rõ ràng
- Có thể thêm sáng tạo cá nhân`;

  // Check recording support on component mount
  useEffect(() => {
    // Check if recording is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingSupported(false);
      return;
    }

    // Check if we're on HTTPS or localhost
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      setRecordingSupported(false);
      return;
    }

    // Check MediaRecorder support
    if (!window.MediaRecorder) {
      setRecordingSupported(false);
    }
  }, []);

  // Cleanup audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Start recording
  const startRecording = async () => {
    try {
      // Check if MediaRecorder is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ thu âm. Vui lòng sử dụng Chrome, Firefox, Safari hoặc Edge mới nhất.');
      }

      // Check if we're on HTTPS or localhost
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('Thu âm chỉ hoạt động trên HTTPS. Vui lòng sử dụng file upload thay thế.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordedChunks(chunks);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setErrorMessage('Lỗi khi thu âm. Vui lòng thử lại hoặc sử dụng file upload.');
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setMediaRecorder(mediaRecorder);
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorMessage(error.message || 'Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập hoặc sử dụng file upload.');
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
    } else if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // Play recorded audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Pause audio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    } else {
      alert('Vui lòng chọn file audio hợp lệ');
    }
  };

  // Validate form - bắt buộc phải có email hoặc số điện thoại
  const isFormValid = () => {
    const hasContact = (email.trim() !== '' || phone.trim() !== '');
    const hasAudio = audioBlob || selectedFile;
    console.log('Form validation:', { hasContact, hasAudio, email, phone });
    return hasContact && hasAudio;
  };

  // Check if contact info is valid
  const isContactInfoValid = () => {
    return email.trim() !== '' || phone.trim() !== '';
  };

  // Submit form
  const handleSubmit = async () => {
    setErrorMessage('');
    
    if (!isContactInfoValid()) {
      setErrorMessage('Vui lòng nhập email hoặc số điện thoại để chúng tôi có thể liên hệ lại!');
      return;
    }
    
    if (!audioBlob && !selectedFile) {
      setErrorMessage('Vui lòng thu âm hoặc tải lên file audio!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('phone', phone);
      
      if (audioBlob) {
        formData.append('audioFile', audioBlob, 'voice-test.wav');
      }
      
      if (selectedFile) {
        formData.append('audioFile', selectedFile);
      }

      console.log('Sending data:', { email, phone, hasAudioBlob: !!audioBlob, hasSelectedFile: !!selectedFile });

      const response = await fetch('/api/voice-test-submission', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setEmail('');
          setPhone('');
          setAudioBlob(null);
          setSelectedFile(null);
          setAudioUrl(null);
          setIsSubmitted(false);
        }, 2000);
      } else {
        throw new Error('Có lỗi xảy ra khi gửi bài test');
      }
    } catch (error) {
      console.error('Error submitting voice test:', error);
      setErrorMessage('Có lỗi xảy ra khi gửi bài test. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center popup-voice-test p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-bold">Test Giọng MC - Q&K Bắc Giang</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row h-[calc(95vh-80px)] sm:h-[70vh]">
          {/* Left side - MC Script */}
          <div className="w-full sm:w-1/2 p-3 sm:p-6 border-r-0 sm:border-r border-gray-200 overflow-y-auto">
            <div className="bg-gray-50 rounded-lg p-2 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line max-h-48 md:max-h-screen overflow-y-auto">
              {mcScript}
            </div>
          </div>

          {/* Right side - Recording/Upload */}
          <div className="w-full sm:w-1/2 p-3 sm:p-6 flex flex-col">
            <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">Thu âm hoặc tải file</h3>
            
            {/* Recording Section */}
            <div className="mb-2 sm:mb-4">
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
                {!recordingSupported ? (
                  <div className="text-center">
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg">
                      <p className="text-xs">
                        <strong>Thu âm không khả dụng</strong> - Vui lòng tải file bên dưới
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Recording Controls */}
                    <div className="flex items-center justify-center space-x-3">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
                        >
                          <Mic size={16} />
                          <span>Thu âm</span>
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={togglePause}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors text-sm"
                          >
                            {isPaused ? <Play size={16} /> : <Pause size={16} />}
                            <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
                          </button>
                          <button
                            onClick={stopRecording}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors text-sm"
                          >
                            <Square size={16} />
                            <span>Dừng</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Recording Status */}
                    {isRecording && (
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-pink-600">
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Đang thu âm...</span>
                        </div>
                      </div>
                    )}

                    {/* Audio File Display - Only show when audio is ready */}
                    {(audioBlob || selectedFile) && (
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            <span className="text-sm font-medium text-pink-800">
                              {audioBlob ? 'Đã thu âm thành công' : 'File đã tải lên'}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              if (audioUrl) {
                                URL.revokeObjectURL(audioUrl);
                              }
                              setAudioBlob(null);
                              setAudioUrl(null);
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="text-rose-500 hover:text-rose-700 text-sm px-2 py-1 rounded hover:bg-rose-50"
                          >
                            Xóa
                          </button>
                        </div>
                        
                        {/* Play Button - Only show when audio is ready */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={isPlaying ? pauseAudio : playAudio}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 disabled:opacity-50"
                          >
                            {isPlaying ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              <Play size={12} />
                            )}
                            <span>{isPlaying ? 'Đang phát...' : 'Phát'}</span>
                          </button>
                          <span className="text-xs text-gray-600">
                            {audioBlob ? `${Math.round(audioBlob.size / 1024)} KB` : 
                             selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : ''}
                          </span>
                        </div>
                        <audio
                          ref={audioRef}
                          src={audioUrl}
                          onEnded={() => setIsPlaying(false)}
                          className="w-full mt-2"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  {recordingSupported ? 'Hoặc tải file lên' : 'Tải file audio'}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {!selectedFile && !audioBlob && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
                  >
                    <Upload size={16} />
                    <span>Chọn file</span>
                  </button>
                )}
                {selectedFile && (
                  <p className="text-xs text-gray-600 mt-2 truncate">
                    {selectedFile.name}
                  </p>
                )}
                
                {/* Hướng dẫn */}
                <div className="mt-2 text-xs text-gray-500">
                  <p><strong>Hỗ trợ:</strong> MP3, WAV, M4A, OGG (max 50MB)</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-2 sm:mb-4">
              <h4 className="text-xs sm:text-base font-semibold text-gray-800 mb-1 sm:mb-3">Thông tin liên hệ</h4>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email hoặc số điện thoại <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={email || phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Auto-detect if it's email or phone
                    if (value.includes('@')) {
                      setEmail(value);
                      setPhone('');
                    } else {
                      setPhone(value);
                      setEmail('');
                    }
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    !email && !phone ? 'border-rose-300 bg-rose-50' : 'border-gray-300'
                  }`}
                  placeholder="Nhập email hoặc số điện thoại"
                />
                <p className="text-xs text-gray-500 mt-1">
                  * Bắt buộc điền email hoặc số điện thoại
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-3 bg-rose-100 text-rose-800 px-3 py-2 rounded-lg flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-auto sticky bottom-0 bg-white pt-1 sm:pt-0">
              {isSubmitted ? (
                <div className="bg-pink-100 text-pink-800 px-3 py-2 rounded-lg flex items-center justify-center space-x-2 text-xs sm:text-sm">
                  <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                  <span>Đã gửi thành công!</span>
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm ${
                    isFormValid() && !isSubmitting
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} className="sm:w-4 sm:h-4" />
                      <span>Gửi bài test</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceTestPopup;
