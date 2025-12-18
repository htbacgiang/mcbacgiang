# ScrollingGallery Component

Component gallery ảnh với hiệu ứng cuộn ngang cho BT Academy.

## Tính năng

- ✨ **Hiệu ứng cuộn ngang**: Hàng trên chạy từ phải sang trái, hàng dưới chạy từ trái qua phải
- 🖼️ **Lightbox**: Xem ảnh full size với điều hướng next/previous
- ⌨️ **Keyboard Navigation**: Hỗ trợ phím tắt (ESC, Left/Right Arrow)
- 📱 **Responsive**: Tối ưu cho mọi thiết bị
- ⏯️ **Play/Pause**: Điều khiển tạm dừng animation
- 🚀 **Performance**: Lazy loading và preload images
- 🎨 **Modern UI**: Thiết kế đẹp mắt với hover effects

## Cách sử dụng

### 1. Import component

```jsx
import { ScrollingGallery } from '../components/gallery';
```

### 2. Import CSS (trong Head của page)

```jsx
<link rel="stylesheet" href="/styles/gallery.css" />
```

### 3. Sử dụng component

```jsx
function MyPage() {
  return (
    <div>
      <ScrollingGallery />
    </div>
  );
}
```

## Cấu trúc dữ liệu ảnh

Component sử dụng array `galleryImages` với cấu trúc:

```javascript
const galleryImages = [
  {
    id: 1,
    src: "/images/gallery/image-1.jpg",
    alt: "Mô tả ảnh",
    title: "Tiêu đề ảnh",
    description: "Mô tả chi tiết"
  }
  // ...
];
```

## Customization

### Thay đổi tốc độ animation

Trong file `styles/gallery.css`, sửa duration:

```css
.animate-scroll-right-to-left {
  animation: scroll-right-to-left 30s linear infinite; /* Thay đổi 30s */
}
```

### Thay đổi kích thước ảnh

Trong component, sửa class:

```jsx
<div className="w-80 h-52"> {/* Thay đổi width và height */}
```

### Thay đổi màu sắc theme

Sửa các class color:
- `text-orange-500` → màu text
- `bg-orange-500` → màu background
- `hover:bg-orange-600` → màu hover

## Keyboard Shortcuts

| Phím | Chức năng |
|------|-----------|
| `ESC` | Đóng lightbox |
| `←` | Ảnh trước |
| `→` | Ảnh tiếp |
| `Space` | Play/Pause animation |

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Dependencies

- React 16.8+
- react-icons
- Tailwind CSS
- Next.js (optional)

## Performance Tips

1. **Optimize images**: Sử dụng WebP format và responsive images
2. **Lazy loading**: Component đã tích hợp sẵn
3. **Preloading**: Ảnh được preload tự động
4. **Animation**: Sử dụng CSS transforms để có performance tốt nhất

## Folder Structure

```
components/
  gallery/
    ├── ScrollingGallery.jsx    # Main component
    ├── index.js                # Export file
    └── README.md               # Documentation
styles/
  └── gallery.css               # Styles & animations
hooks/
  └── useImageLoader.js         # Image loading hook
```

## Examples

### Basic Usage

```jsx
import { ScrollingGallery } from '../components/gallery';

export default function Gallery() {
  return (
    <main>
      <h1>Thư viện ảnh</h1>
      <ScrollingGallery />
    </main>
  );
}
```

### With Custom Data

Để sử dụng dữ liệu ảnh riêng, sửa array `galleryImages` trong component.

### Integration with CMS

```jsx
import { ScrollingGallery } from '../components/gallery';

export default function Gallery({ images }) {
  return (
    <main>
      <ScrollingGallery images={images} />
    </main>
  );
}

export async function getStaticProps() {
  const images = await fetchImagesFromCMS();
  return { props: { images } };
}
```
