export default {
  title: '1. Style/Assets',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
프로젝트에서 사용되는 이미지 및 비디오 에셋

모든 에셋은 \`src/assets/product/\` 폴더에 저장되어 있습니다.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

const AssetCard = ({ src, label, type = 'image' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '16px',
    width: '250px',
  }}>
    <div style={{
      width: '100%',
      aspectRatio: '1/1',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {type === 'video' ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <img
          src={src}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </div>
    <div style={{
      fontSize: '13px',
      color: '#666',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {label}
    </div>
  </div>
);

const AssetGrid = ({ children }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    padding: '20px',
  }}>
    {children}
  </div>
);

const ProductRow = ({ children, label }) => (
  <div style={{ marginBottom: '30px' }}>
    {label && (
      <h4 style={{
        marginBottom: '12px',
        fontFamily: 'system-ui',
        fontSize: '14px',
        fontWeight: '500',
        color: '#666',
        paddingLeft: '20px',
      }}>
        {label}
      </h4>
    )}
    <div style={{
      display: 'flex',
      gap: '20px',
      padding: '0 20px',
      flexWrap: 'wrap',
    }}>
      {children}
    </div>
  </div>
);

export const AllAssets = {
  render: () => (
    <div>
      <h3 style={{
        marginBottom: '30px',
        fontFamily: 'system-ui',
        fontSize: '18px',
        fontWeight: '500',
        paddingLeft: '20px',
      }}>
        전체 에셋 (제품별 정리)
      </h3>

      <ProductRow label="제품 1">
        <AssetCard src="/src/assets/product/1-1.png" label="1-1.png" />
        <AssetCard src="/src/assets/product/1-2.png" label="1-2.png" />
        <AssetCard src="/src/assets/product/1-motion.mp4" label="1-motion.mp4" type="video" />
      </ProductRow>

      <ProductRow label="제품 2">
        <AssetCard src="/src/assets/product/2-1.png" label="2-1.png" />
        <AssetCard src="/src/assets/product/2-2.png" label="2-2.png" />
        <AssetCard src="/src/assets/product/2-motion.mp4" label="2-motion.mp4" type="video" />
      </ProductRow>

      <ProductRow label="제품 3">
        <AssetCard src="/src/assets/product/3-1.png" label="3-1.png" />
        <AssetCard src="/src/assets/product/3-2.png" label="3-2.png" />
        <AssetCard src="/src/assets/product/3-motion.mp4" label="3-motion.mp4" type="video" />
      </ProductRow>

      <ProductRow label="제품 4">
        <AssetCard src="/src/assets/product/4-1.png" label="4-1.png" />
        <AssetCard src="/src/assets/product/4-2.png" label="4-2.png" />
        <AssetCard src="/src/assets/product/4-motion.mp4" label="4-motion.mp4" type="video" />
      </ProductRow>

      <ProductRow label="제품 5">
        <AssetCard src="/src/assets/product/5-1.png" label="5-1.png" />
        <AssetCard src="/src/assets/product/5-2.png" label="5-2.png" />
        <AssetCard src="/src/assets/product/5-motion.mp4" label="5-motion.mp4" type="video" />
      </ProductRow>

      <ProductRow label="제품 6">
        <AssetCard src="/src/assets/product/6-1.png" label="6-1.png" />
        <AssetCard src="/src/assets/product/6-2.png" label="6-2.png" />
        <AssetCard src="/src/assets/product/6-motion.mp4" label="6-motion.mp4" type="video" />
      </ProductRow>
    </div>
  ),
};
