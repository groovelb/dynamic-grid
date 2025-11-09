import { useState } from 'react';
import Header from '../Header';

export default {
  title: '2. Components/Navigation/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
애플리케이션 상단 네비게이션 바 - 필터링 및 줌 제어

### 버튼 역할

- **네비게이션 버튼 (+/←)**: 그리드 컬럼 수 조절 (0→1→2 확대) 및 상세 뷰 닫기
- **성별 필터 (GridFour/TShirt/Dress)**: 제품을 성별로 필터링 (all/male/female)
- **색상 필터 (all/○/●)**: 제품을 색상으로 필터링 (all/white/black)
- **장바구니 (ShoppingCart)**: 장바구니 페이지 이동 (TODO)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onNavigate: {
      description: '네비게이션 버튼 클릭 핸들러',
      table: {
        type: { summary: 'function' },
      },
    },
    onFilterChange: {
      description: '성별 필터 변경 핸들러',
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onColorFilterChange: {
      description: '색상 필터 변경 핸들러',
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onCartClick: {
      description: '장바구니 버튼 클릭 핸들러',
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: 'undefined' },
      },
    },
    currentFilter: {
      description: '현재 선택된 성별 필터',
      control: { type: 'select' },
      options: ['all', 'male', 'female'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'all' },
      },
    },
    currentColorFilter: {
      description: '현재 선택된 색상 필터',
      control: { type: 'select' },
      options: ['all', 'white', 'black'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'all' },
      },
    },
    isZoomedIn: {
      description: '그리드 확대 상태 여부 (Item Zoom 또는 Grid Zoom 최대)',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isZoomEnabled: {
      description: 'Zoom 기능 활성화 여부 (모바일에서는 비활성화)',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    headerPadding: {
      description: '헤더 패딩 (CSS 문법)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '20px 40px' },
      },
    },
    buttonSize: {
      description: '버튼 크기 (px)',
      control: { type: 'number', min: 20, max: 80, step: 4 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '48' },
      },
    },
  },
};

export const Default = {
  render: () => {
    const [isZoomedIn, setIsZoomedIn] = useState(false);
    const [genderFilter, setGenderFilter] = useState('all');
    const [colorFilter, setColorFilter] = useState('all');

    return (
      <div>
        <Header
          onNavigate={() => {
            setIsZoomedIn(!isZoomedIn);
          }}
          onFilterChange={(filter) => {
            setGenderFilter(filter);
          }}
          onColorFilterChange={(color) => {
            setColorFilter(color);
          }}
          onCartClick={() => {}}
          currentFilter={genderFilter}
          currentColorFilter={colorFilter}
          isZoomedIn={isZoomedIn}
          isZoomEnabled={true}
          headerPadding="20px 40px"
          buttonSize={44}
        />

        {/* 현재 상태 요약 */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          fontSize: '14px',
          zIndex: 10000,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <table style={{
            borderCollapse: 'collapse',
            width: '100%',
          }}>
            <tbody>
              <tr>
                <td style={{
                  padding: '8px 16px',
                  borderRight: '1px solid #e0e0e0',
                  color: '#666',
                  fontWeight: '500',
                }}>
                  Grid Columns
                </td>
                <td style={{
                  padding: '8px 16px',
                  color: '#000',
                }}>
                  {isZoomedIn ? '1열 (확대)' : '다열 (기본)'}
                </td>
              </tr>
              <tr>
                <td style={{
                  padding: '8px 16px',
                  borderRight: '1px solid #e0e0e0',
                  borderTop: '1px solid #e0e0e0',
                  color: '#666',
                  fontWeight: '500',
                }}>
                  성별
                </td>
                <td style={{
                  padding: '8px 16px',
                  borderTop: '1px solid #e0e0e0',
                  color: '#000',
                }}>
                  {genderFilter === 'all' ? '전체' : genderFilter === 'male' ? '남성' : '여성'}
                </td>
              </tr>
              <tr>
                <td style={{
                  padding: '8px 16px',
                  borderRight: '1px solid #e0e0e0',
                  borderTop: '1px solid #e0e0e0',
                  color: '#666',
                  fontWeight: '500',
                }}>
                  색상
                </td>
                <td style={{
                  padding: '8px 16px',
                  borderTop: '1px solid #e0e0e0',
                  color: '#000',
                }}>
                  {colorFilter === 'all' ? '전체' : colorFilter === 'white' ? '흰색' : '검은색'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  },
};
