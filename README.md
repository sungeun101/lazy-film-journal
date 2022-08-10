Serverless (...?!) using NextJS, Tailwind, Prisma, PlanetScale and Cloudflare

## NextJS Images

### Local Images

로컬 이미지를 사용하려면 .jpg, .png 또는 .webp 파일을 가져옵니다.
동적 await import() 또는 require()는 지원되지 않습니다.
import는 빌드 시 분석할 수 있도록 static이어야 합니다.
Next.js는 가져온 파일을 기반으로 이미지의 너비와 높이를 자동으로 결정합니다.

### Remote Images

원격 이미지를 사용하려면 src 속성이 URL 문자열이어야 하며 relative 또는 absolute일 수 있습니다. Next.js는 빌드 프로세스 동안 원격 파일에 액세스할 수 없으므로 width, height 및 선택적 blurDataURL props을 수동으로 제공해야 합니다.

### layout

뷰포트의 크기가 변경될 때 이미지의 레이아웃 동작입니다.

layout options
intrinsic (default): 이미지 크기까지 컨테이너 너비에 맞게 축소
fixed: 너비와 높이를 이미지의 크기에 맞게 조절
responsive: 컨테이너 너비에 맞게 크기 조정
fill (width와 height를 주지 않았을 때 줘야하는 속성): 컨테이너를 채우기 위해 X 및 Y 축 모두에서 성장

objectFit (NextJS)
NextJS에서 Image컴포넌트의 layout="fill"을 사용할 때 이미지가 상위 부모 요소에 맞춰서 어떻게 보여질 지를 정의합니다. 이 값은 이미지의 스타일의 object-fit 속성으로 지정됩니다.
https://nextjs.org/docs/api-reference/next/image#objectfit

object-fit
img나 video태그의 콘텐츠 크기를 어떤 방식으로 조절해 요소에 맞출 것인지 지정합니다.
object-position 속성을 사용해 대체 요소 콘텐츠가 콘텐츠 박스 내에 위치할 지점을 바꿀 수 있습니다.
object-fit을 tailwind로도 줄 수 있지만 Image컴포넌트에서 제공하는 objectFit="cover"을 통해 줄 수도 있습니다.

If you aren't curious, you can't learn.
