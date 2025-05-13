import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

const Banner: React.FC = () => {
  return (
    <div className="w-full relative group">
      <Swiper
        spaceBetween={10}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="w-full h-[300px] md:h-[500px]"
      >
        <SwiperSlide>
          <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-lg">
            <Image
              src="/image/banner1.png"
              alt="Coleção de Inverno"
              fill
              className="object-cover"
              quality={100} // Define a qualidade máxima da imagem
              priority // Carrega esta imagem com prioridade
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                Coleção de Inverno
              </h2>
              <p className="text-sm md:text-base mb-4 max-w-md text-center">
                Descubra nossa nova coleção de inverno com peças exclusivas e
                elegantes.
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-lg">
            <Image
              src="/image/banner2.png"
              alt="Promoções Especiais"
              fill
              className="object-cover"
              quality={100} // Define a qualidade máxima da imagem
              priority // Carrega esta imagem com prioridade
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                Promoções Especiais
              </h2>
              <p className="text-sm md:text-base mb-4 max-w-md text-center">
                Até 50% de desconto em peças selecionadas. Aproveite enquanto
                durar o estoque.
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-lg">
            <Image
              src="/image/banner3.png"
              alt="Novos Acessórios"
              fill
              className="object-cover"
              quality={100} // Define a qualidade máxima da imagem
              priority // Carrega esta imagem com prioridade
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                Novos Acessórios
              </h2>
              <p className="text-sm md:text-base mb-4 max-w-md text-center">
                Complete seu visual com nossa nova linha de acessórios
                minimalistas.
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;