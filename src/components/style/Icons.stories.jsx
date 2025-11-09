import {
  GridFour,
  TShirt,
  Dress,
  CaretLeft,
  Plus,
  ShoppingCart,
  Circle
} from '@phosphor-icons/react';

export default {
  title: '1. Style/Icons',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
프로젝트에서 사용되는 Phosphor Icons 목록

모든 아이콘은 [@phosphor-icons/react](https://phosphoricons.com/) 라이브러리에서 가져옵니다.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

const IconWrapper = ({ children, label }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    minWidth: '120px',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      backgroundColor: '#f5f5f5',
    }}>
      {children}
    </div>
    <div style={{
      fontSize: '12px',
      color: '#666',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {label}
    </div>
  </div>
);

const IconGrid = ({ children }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
    padding: '20px',
  }}>
    {children}
  </div>
);

export const NavigationIcons = {
  render: () => (
    <IconGrid>
      <IconWrapper label="Plus (확대)">
        <Plus size={32} weight="light" />
      </IconWrapper>
      <IconWrapper label="CaretLeft (뒤로)">
        <CaretLeft size={32} weight="light" />
      </IconWrapper>
      <IconWrapper label="ShoppingCart">
        <ShoppingCart size={32} weight="light" />
      </IconWrapper>
    </IconGrid>
  ),
};

export const FilterIcons = {
  render: () => (
    <IconGrid>
      <IconWrapper label="GridFour (전체)">
        <GridFour size={32} weight="light" />
      </IconWrapper>
      <IconWrapper label="TShirt (남성)">
        <TShirt size={32} weight="light" />
      </IconWrapper>
      <IconWrapper label="Dress (여성)">
        <Dress size={32} weight="light" />
      </IconWrapper>
      <IconWrapper label="Circle (흰색)">
        <Circle size={32} weight="light" />
      </IconWrapper>
      <IconWrapper label="Circle (검은색)">
        <Circle size={32} weight="fill" />
      </IconWrapper>
    </IconGrid>
  ),
};

export const AllIcons = {
  render: () => (
    <div>
      <h3 style={{ marginBottom: '20px', fontFamily: 'system-ui', fontSize: '18px', fontWeight: '500' }}>
        Navigation
      </h3>
      <IconGrid>
        <IconWrapper label="Plus">
          <Plus size={32} weight="light" />
        </IconWrapper>
        <IconWrapper label="CaretLeft">
          <CaretLeft size={32} weight="light" />
        </IconWrapper>
        <IconWrapper label="ShoppingCart">
          <ShoppingCart size={32} weight="light" />
        </IconWrapper>
      </IconGrid>

      <h3 style={{ marginTop: '40px', marginBottom: '20px', fontFamily: 'system-ui', fontSize: '18px', fontWeight: '500' }}>
        Filters
      </h3>
      <IconGrid>
        <IconWrapper label="GridFour">
          <GridFour size={32} weight="light" />
        </IconWrapper>
        <IconWrapper label="TShirt">
          <TShirt size={32} weight="light" />
        </IconWrapper>
        <IconWrapper label="Dress">
          <Dress size={32} weight="light" />
        </IconWrapper>
        <IconWrapper label="Circle (light)">
          <Circle size={32} weight="light" />
        </IconWrapper>
        <IconWrapper label="Circle (fill)">
          <Circle size={32} weight="fill" />
        </IconWrapper>
      </IconGrid>
    </div>
  ),
};

export const IconSizes = {
  render: () => (
    <div>
      <h3 style={{ marginBottom: '20px', fontFamily: 'system-ui', fontSize: '18px', fontWeight: '500' }}>
        Size Examples (Plus Icon)
      </h3>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
        <div style={{ textAlign: 'center' }}>
          <Plus size={16} weight="light" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>16px</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Plus size={24} weight="light" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>24px</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Plus size={32} weight="light" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>32px (기본)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Plus size={40} weight="light" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>40px</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Plus size={48} weight="light" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>48px</div>
        </div>
      </div>
    </div>
  ),
};

export const IconWeights = {
  render: () => (
    <div>
      <h3 style={{ marginBottom: '20px', fontFamily: 'system-ui', fontSize: '18px', fontWeight: '500' }}>
        Weight Variations (Circle Icon)
      </h3>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Circle size={32} weight="thin" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>thin</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Circle size={32} weight="light" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>light (기본)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Circle size={32} weight="regular" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>regular</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Circle size={32} weight="bold" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>bold</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Circle size={32} weight="fill" />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>fill</div>
        </div>
      </div>
    </div>
  ),
};
