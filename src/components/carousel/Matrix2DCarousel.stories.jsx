import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Matrix2DCarousel from './Matrix2DCarousel';
import products from '../../data/products';

export default {
  title: '2. Components/Carousel/Matrix2DCarousel',
  component: Matrix2DCarousel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
2D 매트릭스 캐로셀 - 제품 상세 뷰

제품 상세 페이지에서 **세로 스크롤로 제품을 전환**하고, **가로 화살표로 착용샷을 탐색**할 수 있는 2차원 네비게이션 컴포넌트입니다.

---

### 사용자 시나리오

#### 1. 제품 이미지 탐색 (가로축)
- 좌우 화살표 버튼으로 현재 제품의 다양한 착용샷 확인
- 하단 인디케이터를 클릭하여 원하는 이미지로 직접 이동
- 첫 번째 이미지는 항상 착용 영상 (자동 재생)
- 나머지는 정적 이미지 (상세 컷, 다양한 각도)

#### 2. 제품 전환 (세로축)
- 마우스 휠 또는 키보드 ↑↓로 이전/다음 제품으로 즉시 전환
- 제품이 바뀌면 해당 제품의 첫 번째 이미지(영상)부터 시작
- 그리드로 돌아가지 않고 여러 제품을 연속으로 비교 가능

#### 3. 상세 뷰 닫기
- ESC 키를 누르면 그리드 뷰로 복귀
- onClose 콜백을 통해 부모에게 알림

---

### 필요한 Props

필수 Props:
- items: 제품 배열
  - 각 제품은 id, name, images 필드 필요
  - images 배열: [비디오 URL, 이미지 URL들...]

- initialItemId: 처음 표시할 제품 ID

- onItemChange: 제품 변경 시 호출되는 콜백 함수
  - 새로운 제품 ID를 인자로 받음
  - 부모 컴포넌트에서 현재 선택된 제품 추적

- onClose: 캐로셀 닫기 콜백 (ESC 키 시 호출)

선택적 Props:
- config: 반응형 설정 객체
  - viewWidth: 뷰 너비 (기본값: '70vw')
  - arrowSize: 화살표 버튼 크기 (기본값: 40)
  - arrowPosition: 화살표 위치 (기본값: 20)
  - indicatorSize: 인디케이터 크기 (기본값: 8)

---

### AI 프롬프트 - 컴포넌트 재생성

\`\`\`
Matrix2DCarousel 컴포넌트를 만들어주세요.

컴포넌트 역할:
- 제품 상세 페이지에서 2차원 네비게이션 제공
- 가로축: 현재 제품의 다양한 이미지(착용샷, 상세샷) 탐색
- 세로축: 다른 제품으로 빠르게 전환
- 그리드로 돌아가지 않고도 여러 제품을 연속으로 비교 가능

사용자 인터랙션:

1. 이미지 탐색 (가로 네비게이션)
   - 좌우 화살표 버튼 클릭으로 현재 제품의 이미지 전환
   - 첫 번째 이미지는 항상 착용 영상 (자동 재생, 무음, 반복)
   - 나머지 이미지는 정적 이미지 (다양한 각도, 디테일 샷)
   - 하단 인디케이터에서 현재 위치 확인 및 원하는 이미지로 직접 이동
   - 인디케이터 점 클릭으로 특정 이미지로 즉시 점프

2. 제품 전환 (세로 네비게이션)
   - 마우스 휠 스크롤(위/아래)로 이전/다음 제품 전환
   - 키보드 화살표 ↑↓로도 제품 전환 가능
   - 제품이 바뀌면 해당 제품의 첫 번째 이미지부터 시작
   - 필터링된 제품 목록 내에서만 순환 (첫 제품에서 위로 가면 마지막 제품으로)
   - 제품 변경 시 onItemChange 콜백으로 부모에게 새 제품 ID 전달

3. 캐로셀 닫기
   - ESC 키를 누르면 onClose 콜백 호출
   - 부모(ProductDetailView)가 오버레이 제거하여 그리드로 복귀

필요한 Props:

필수 Props:
- items: 제품 배열
  - 각 제품 객체는 id, name, images 필드 필요
  - images 배열: [비디오 URL, 이미지 URL, 이미지 URL, ...]
  - 최소 1개 이상의 미디어 필요

- initialItemId: 처음 표시할 제품의 ID
  - 사용자가 그리드에서 클릭한 제품
  - items 배열에서 이 ID를 찾아 해당 제품부터 시작

- onItemChange: 제품 변경 콜백 함수
  - 휠 스크롤이나 키보드로 제품 전환 시 호출
  - 새로운 제품 ID를 인자로 받음
  - 부모가 이를 받아 현재 선택 상태 업데이트

- onClose: 캐로셀 닫기 콜백
  - ESC 키 누를 때 호출
  - 부모가 오버레이를 제거하여 그리드 뷰로 복귀

선택적 Props:
- config: 반응형 설정 객체
  - viewWidth: 캐로셀 뷰 너비 (예: '70vw', '800px')
  - arrowSize: 좌우 화살표 버튼 크기 (px)
  - arrowPosition: 화살표 버튼이 캐로셀 가장자리에서 떨어진 거리 (px)
  - indicatorSize: 하단 인디케이터 점 크기 (px)

부모 컴포넌트와의 관계:

- ProductDetailView: 이 컴포넌트를 전체 화면 오버레이 안에 배치
  - productId를 initialItemId로 전달
  - filteredProducts를 items로 전달
  - onItemChange로 제품 전환 감지
  - onClose로 오버레이 닫기 처리

- MainPage: ProductDetailView를 통해 간접적으로 연결
  - 최종적으로 selectedProductId 상태 관리
  - 제품 전환 시 상태 업데이트

구현 포인트:

1. 2차원 상태 관리
   - 현재 제품 인덱스 (세로축): items 배열에서의 위치
   - 현재 이미지 인덱스 (가로축): 선택된 제품의 images 배열에서의 위치
   - 제품이 바뀌면 이미지 인덱스를 0으로 리셋

2. 가로 네비게이션 (이미지 전환)
   - 좌측 화살표: 이전 이미지 (인덱스 감소)
   - 우측 화살표: 다음 이미지 (인덱스 증가)
   - 첫 이미지에서 왼쪽: 마지막 이미지로 순환
   - 마지막 이미지에서 오른쪽: 첫 이미지로 순환
   - 인디케이터 클릭: 해당 인덱스로 직접 이동

3. 세로 네비게이션 (제품 전환)
   - 휠 이벤트 감지: deltaY > 0이면 다음 제품, < 0이면 이전 제품
   - 키보드 이벤트: ArrowDown은 다음, ArrowUp은 이전
   - 제품 인덱스 순환: (currentIndex + 1) % items.length
   - 제품 변경 시 onItemChange(newProductId) 호출

4. 미디어 렌더링
   - 첫 번째 항목(.mp4): video 태그로 렌더링
     - autoplay, loop, muted 속성
     - playsInline으로 모바일 대응
   - 나머지 항목: img 태그로 렌더링
     - object-fit: contain으로 비율 유지

5. 인디케이터
   - 현재 이미지 개수만큼 점 표시
   - 활성 점은 다른 색상/크기로 강조
   - 각 점 클릭 시 해당 이미지로 이동

6. 키보드 접근성
   - ESC: 캐로셀 닫기
   - ← →: 이미지 전환
   - ↑ ↓: 제품 전환
   - 포커스 트랩: 캐로셀 열려 있는 동안 포커스 유지

엣지 케이스:
- items가 빈 배열: 아무것도 렌더링 안 함
- initialItemId가 items에 없는 경우: 첫 제품 표시
- 제품의 images가 빈 배열: placeholder 표시
- 제품이 1개뿐일 때: 세로 네비게이션 비활성화
- 이미지가 1개뿐일 때: 화살표와 인디케이터 숨김
- 빠른 휠 스크롤: debounce 처리로 과도한 전환 방지
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

const WithProductsComponent = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [isClosed, setIsClosed] = useState(false);

  const handleItemChange = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosed(true);
  }, []);

  if (isClosed) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui',
        fontSize: '18px',
        color: '#666',
      }}>
        캐로셀이 닫혔습니다. (ESC 키로 닫힘)
        <button
          onClick={() => setIsClosed(false)}
          style={{
            marginLeft: '20px',
            padding: '10px 20px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'system-ui',
          }}
        >
          다시 열기
        </button>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      position: 'relative',
    }}>
      {/* 상단 안내 */}
      <div style={{
        padding: '20px 40px',
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #e0e0e0',
        fontFamily: 'system-ui',
        fontSize: '13px',
        color: '#666',
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#000' }}>
          2D 매트릭스 캐로셀
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>좌우 화살표: 제품의 착용샷 전환 (가로 네비게이션)</li>
          <li>휠 또는 키보드 ↑↓: 제품 전환 (세로 네비게이션)</li>
          <li>비디오는 자동 재생됩니다</li>
          <li>ESC 키로 닫기</li>
        </ul>
      </div>

      {/* 현재 상태 표시 */}
      <div style={{
        position: 'fixed',
        top: '120px',
        right: '20px',
        padding: '12px 20px',
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: '4px',
        fontFamily: 'system-ui',
        fontSize: '14px',
        zIndex: 1000,
      }}>
        현재: Product {selectedId}
      </div>

      {/* 캐로셀 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
      }}>
        <Matrix2DCarousel
          items={products.slice(0, 6)}
          initialItemId={selectedId}
          onItemChange={handleItemChange}
          onClose={handleClose}
          config={{
            viewWidth: '70vw',
            arrowSize: 40,
            arrowPosition: 20,
            indicatorSize: 8,
          }}
        />
      </div>
    </div>
  );
};

export const WithProducts = {
  parameters: {
    docs: {
      disable: true,
    },
  },
  render: () => <WithProductsComponent />,
};
