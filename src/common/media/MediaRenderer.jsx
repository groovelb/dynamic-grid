import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MEDIA_FILTERS } from '../../constants/animations';

/**
 * 비디오 파일인지 확인하는 헬퍼 함수
 */
const isVideo = (src) => {
  if (!src) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
};

/**
 * MediaRenderer 컴포넌트
 *
 * 이미지와 비디오를 자동으로 감지하여 렌더링하는 범용 미디어 렌더러
 *
 * Props:
 * @param {string} src - 미디어 소스 URL
 * @param {string} alt - 이미지 alt 텍스트
 * @param {object} variants - Framer Motion variants (optional)
 * @param {string|number} layoutId - Framer Motion layoutId (optional)
 * @param {object} custom - Framer Motion custom props (optional)
 * @param {string} initial - Framer Motion initial state (optional)
 * @param {string} animate - Framer Motion animate state (optional)
 * @param {string} exit - Framer Motion exit state (optional)
 * @param {object} transition - Framer Motion transition (optional)
 * @param {function} onAnimationStart - Animation start callback (optional)
 * @param {function} onAnimationComplete - Animation complete callback (optional)
 * @param {number} playbackRate - 비디오 재생 속도 (기본값: 1.3)
 * @param {boolean} autoPlay - 비디오 자동 재생 여부 (기본값: true)
 * @param {function} onVideoEnded - 비디오 재생 완료 콜백 (optional)
 * @param {object} style - 추가 인라인 스타일
 * @param {object} videoRef - 외부 비디오 ref (optional)
 *
 * Example:
 * <MediaRenderer
 *   src="/video.mp4"
 *   alt="Product video"
 *   variants={slideVariants}
 *   playbackRate={1.5}
 *   onVideoEnded={() => console.log('ended')}
 * />
 */
function MediaRenderer({
  src,
  alt = '',
  variants,
  layoutId,
  custom,
  initial,
  animate,
  exit,
  transition,
  onAnimationStart,
  onAnimationComplete,
  playbackRate = 1.3,
  autoPlay = true,
  onVideoEnded,
  style = {},
  videoRef: externalVideoRef,
}) {
  const internalVideoRef = useRef(null);
  const videoRef = externalVideoRef || internalVideoRef;

  const isVideoFile = isVideo(src);

  // 비디오 자동 재생 처리
  useEffect(() => {
    if (isVideoFile && videoRef.current && autoPlay) {
      const video = videoRef.current;
      video.playbackRate = playbackRate;
      video.currentTime = 0;
      video.play().catch(err => {
        console.log('Video autoplay prevented:', err);
      });
    }
  }, [src, isVideoFile, autoPlay, playbackRate]);

  const defaultStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    position: 'absolute',
    filter: MEDIA_FILTERS.BRIGHTNESS,
    ...style,
  };

  const motionProps = {
    variants,
    custom,
    initial,
    animate,
    exit,
    transition,
    onAnimationStart,
    onAnimationComplete,
    style: defaultStyle,
  };

  // layoutId는 undefined가 아닐 때만 추가
  if (layoutId) {
    motionProps.layoutId = layoutId;
  }

  if (isVideoFile) {
    return (
      <motion.video
        ref={videoRef}
        src={src}
        muted
        playsInline
        onEnded={onVideoEnded}
        {...motionProps}
      />
    );
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      {...motionProps}
    />
  );
}

export default MediaRenderer;
export { isVideo };
