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

---

### AI 프롬프트 - 컴포넌트 재생성

\`\`\`
Header 컴포넌트를 만들어주세요.

컴포넌트 역할:
- 애플리케이션 상단에 고정되는 네비게이션 바
- 그리드 줌 제어, 제품 필터링, 장바구니 이동 기능 제공
- 사용자가 제품을 탐색하는 데 필요한 모든 컨트롤을 한곳에 모음

사용자 인터랙션:

1. 네비게이션 버튼 (좌측)
   - 제품 상세 뷰나 그리드 확대 상태일 때: 왼쪽 화살표(←) 표시
     - 클릭 시 이전 상태로 복귀 (상세 뷰 닫기 또는 줌 아웃)
     - onNavigate 콜백 호출
   - 기본 그리드 상태일 때: 플러스(+) 표시
     - 클릭 시 그리드 줌 인 (컬럼 수 감소)
     - 모바일에서는 비활성화 (isZoomEnabled=false)

2. 성별 필터 (중앙 좌측)
   - GridFour 아이콘: 전체 제품 표시 (all)
   - TShirt 아이콘: 남성 제품만 표시 (male)
   - Dress 아이콘: 여성 제품만 표시 (female)
   - 현재 선택된 필터는 시각적으로 강조 (배경색 변경)
   - 클릭 시 onFilterChange 콜백으로 필터 값 전달

3. 색상 필터 (중앙 우측)
   - "all" 텍스트: 전체 색상 표시
   - Circle 아이콘 (light): 흰색 제품만 표시
   - Circle 아이콘 (fill): 검은색 제품만 표시
   - 현재 선택된 필터는 시각적으로 강조
   - 클릭 시 onColorFilterChange 콜백으로 색상 값 전달

4. 장바구니 버튼 (우측)
   - ShoppingCart 아이콘
   - 클릭 시 onCartClick 콜백 호출
   - 향후 장바구니 페이지로 이동 예정

필요한 Props:

필수 Props:
- onNavigate: 네비게이션 버튼 클릭 핸들러
  - 상세 뷰 닫기 또는 그리드 줌 아웃 처리
  - 부모(MainPage)가 상태 변경

- onFilterChange: 성별 필터 변경 핸들러
  - 인자: 'all' | 'male' | 'female'
  - 부모가 제품 목록 필터링

- onColorFilterChange: 색상 필터 변경 핸들러
  - 인자: 'all' | 'white' | 'black'
  - 부모가 제품 목록 필터링

- onCartClick: 장바구니 버튼 클릭 핸들러
  - 현재는 placeholder, 향후 장바구니 페이지 이동

- currentFilter: 현재 선택된 성별 필터
  - 'all' | 'male' | 'female'
  - 이 값에 따라 버튼 활성화 상태 표시

- currentColorFilter: 현재 선택된 색상 필터
  - 'all' | 'white' | 'black'
  - 이 값에 따라 버튼 활성화 상태 표시

- isZoomedIn: 현재 줌 상태
  - true: 제품 상세 뷰 진입 또는 그리드 최대 확대 상태
  - false: 기본 그리드 상태
  - 네비게이션 버튼 아이콘 결정 (← vs +)

선택적 Props:
- isZoomEnabled: 줌 기능 활성화 여부 (기본값: true)
  - 모바일 환경에서는 false로 설정
  - false일 때 네비게이션 버튼 비활성화

- headerPadding: 헤더 패딩 (기본값: '20px 40px')
  - 반응형 디자인에 따라 조정
  - CSS padding 문법 사용

- buttonSize: 버튼 크기 (기본값: 48)
  - px 단위로 버튼의 width와 height 설정
  - 작은 화면에서는 더 작은 값 사용

부모 컴포넌트와의 관계:

- MainPage: 이 컴포넌트를 최상단에 배치
  - 모든 필터와 줌 상태 관리
  - onNavigate, onFilterChange, onColorFilterChange, onCartClick 구현
  - currentFilter, currentColorFilter, isZoomedIn 전달

구현 포인트:

1. 고정 헤더
   - position: fixed, top: 0, left: 0
   - width: 100%, z-index 높게 설정
   - 스크롤해도 항상 상단에 표시

2. 레이아웃
   - display: flex, justify-content: space-between
   - 좌측: 네비게이션 버튼
   - 중앙: 필터 버튼들 (성별 + 색상)
   - 우측: 장바구니 버튼

3. 버튼 스타일링
   - 정사각형 버튼 (buttonSize로 크기 설정)
   - 활성 상태: 배경색 변경으로 시각적 피드백
   - hover 효과: opacity 또는 배경색 변화
   - 비활성 상태: opacity 감소, pointer-events: none

4. 아이콘 사용
   - @phosphor-icons/react 라이브러리
   - Plus, CaretLeft, GridFour, TShirt, Dress, Circle, ShoppingCart
   - weight="light" 기본 사용

5. 반응형 대응
   - headerPadding으로 여백 조정
   - buttonSize로 버튼 크기 조정
   - 모바일에서는 isZoomEnabled=false로 줌 비활성화

엣지 케이스:
- 모바일에서 isZoomEnabled=false: 네비게이션 버튼 숨김 또는 비활성화
- 필터 조합: 성별과 색상 필터 동시 적용 가능
- 빠른 필터 전환: 즉시 반영되도록 상태 관리
- 상세 뷰에서 필터 변경: 상세 뷰 닫고 필터링된 그리드 표시
\`\`\`
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
  parameters: {
    docs: {
      disable: true,
    },
  },
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
