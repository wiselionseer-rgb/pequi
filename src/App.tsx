/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Plus,
  Minus,
  Check,
  X,
  Eye,
  ArrowDown,
  MapPin,
  Truck,
  MessageCircle,
  Store,
  Copy,
} from 'lucide-react';
import { PRODUCTS, BACKGROUND_CAROUSEL_IMAGES } from './data/pequiData';

type DeliveryOption = 'primavera' | 'retirada' | 'outras_cidades';
type PaymentOption = 'PIX' | 'Cartão' | 'Dinheiro';

const WHATSAPP_NUMBER = '556699548221';
const WHATSAPP_DISPLAY = '(66) 9954-8221';
const PRIMAVERA_FREIGHT = 15;

export default function App() {
  // Background Carousel State (18 images from user attachments 4..21)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [isBackdropSpotlight, setIsBackdropSpotlight] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Direct Order Quantities for each of the 3 products (Super Simple & Didactic)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'pequi-comercial': 0,
    'pequi-gigante': 0,
    'pequi-super-gigante': 0,
  });

  // Lightbox Modal State
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    title: string;
    subtitle: string;
  } | null>(null);

  // Customer Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('primavera');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNeighborhood, setCustomerNeighborhood] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>('PIX');
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Automatic Background Carousel Rotation
  useEffect(() => {
    if (!isCarouselPlaying) return;
    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % BACKGROUND_CAROUSEL_IMAGES.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [isCarouselPlaying]);

  const currentSlide = BACKGROUND_CAROUSEL_IMAGES[activeSlideIndex];
  const nextSlide =
    BACKGROUND_CAROUSEL_IMAGES[(activeSlideIndex + 1) % BACKGROUND_CAROUSEL_IMAGES.length];
  const prevSlide =
    BACKGROUND_CAROUSEL_IMAGES[
      (activeSlideIndex - 1 + BACKGROUND_CAROUSEL_IMAGES.length) %
        BACKGROUND_CAROUSEL_IMAGES.length
    ];

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  };

  const scrollToCheckout = () => {
    const el = document.getElementById('fechar-pedido');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedItems = PRODUCTS.filter((p) => (quantities[p.id] || 0) > 0).map((p) => ({
    ...p,
    quantity: quantities[p.id] || 0,
    subtotal: p.price * (quantities[p.id] || 0),
  }));

  const totalPackagesCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const productsSubtotal = selectedItems.reduce((acc, item) => acc + item.subtotal, 0);
  const shippingCost =
    totalPackagesCount > 0 && deliveryOption === 'primavera' ? PRIMAVERA_FREIGHT : 0;
  const finalOrderTotal = productsSubtotal + shippingCost;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const buildWhatsAppMessage = () => {
    const lines: string[] = [
      '*OLÁ! QUERO FAZER UM PEDIDO — PEQUI OURO DO CERRADO*',
      '----------------------------------',
      '*ITENS ESCOLHIDOS:*',
    ];

    selectedItems.forEach((item) => {
      lines.push(
        `• *${item.quantity}x ${item.name}* (${item.weight}) — ${formatCurrency(item.subtotal)}`
      );
    });

    lines.push('----------------------------------');
    lines.push(`*Valor dos Produtos:* ${formatCurrency(productsSubtotal)}`);

    if (deliveryOption === 'primavera') {
      lines.push(`*Recebimento:* Entrega em Primavera do Leste - MT`);
      lines.push(`*Frete Primavera:* ${formatCurrency(PRIMAVERA_FREIGHT)}`);
      lines.push(`*VALOR TOTAL:* *${formatCurrency(finalOrderTotal)}*`);
    } else if (deliveryOption === 'retirada') {
      lines.push(`*Recebimento:* Retirada no Local (Primavera do Leste - MT)`);
      lines.push(`*Frete:* Grátis (R$ 0,00)`);
      lines.push(`*VALOR TOTAL:* *${formatCurrency(finalOrderTotal)}*`);
    } else {
      lines.push(`*Recebimento:* Entrega em Outra Cidade da Região - MT`);
      lines.push(`*Frete:* A combinar`);
      lines.push(`*TOTAL DOS PRODUTOS:* *${formatCurrency(productsSubtotal)}* (+ frete a combinar)`);
    }

    lines.push('----------------------------------');
    lines.push('*DADOS PARA ENTREGA / RETIRADA:*');
    lines.push(`• *Cliente:* ${customerName.trim() || 'Não informado'}`);

    if (deliveryOption === 'retirada') {
      lines.push(`• *Modalidade:* Vou retirar no local em Primavera do Leste - MT`);
    } else if (deliveryOption === 'primavera') {
      lines.push(`• *Cidade:* Primavera do Leste - MT`);
      lines.push(`• *Endereço:* ${customerAddress.trim() || 'A informar'}`);
      if (customerNeighborhood.trim()) {
        lines.push(`• *Bairro / Referência:* ${customerNeighborhood.trim()}`);
      }
    } else {
      lines.push(`• *Cidade (MT):* ${customerCity.trim() || 'A informar'}`);
      lines.push(`• *Endereço:* ${customerAddress.trim() || 'A informar'}`);
      if (customerNeighborhood.trim()) {
        lines.push(`• *Bairro / Referência:* ${customerNeighborhood.trim()}`);
      }
    }

    lines.push(`• *Forma de Pagamento:* ${paymentMethod}`);
    if (customerNotes.trim()) {
      lines.push(`• *Observação:* ${customerNotes.trim()}`);
    }

    return lines.join('\n');
  };

  const isOrderReady = () => {
    if (totalPackagesCount === 0) return false;
    if (!customerName.trim()) return false;
    if (deliveryOption === 'primavera' && !customerAddress.trim()) return false;
    if (deliveryOption === 'outras_cidades' && (!customerCity.trim() || !customerAddress.trim())) {
      return false;
    }
    return true;
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildWhatsAppMessage()
  )}`;

  const handleCopyOrderText = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppMessage());
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(false);
    }
  };

  const markImageFailed = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }));
  };

  return (
    <div className="relative min-h-screen bg-[#06160F] text-[#FAF6EE] flex flex-col justify-between overflow-x-hidden pb-24 md:pb-0">
      {/* =====================================================================
          DYNAMIC BACKGROUND CAROUSEL LAYER (Images 4 to 21)
      ===================================================================== */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Layer 1: Full-screen ambient blurred backdrop */}
        <div
          key={`blur-${currentSlide.id}`}
          className="absolute inset-0 transition-opacity duration-1000 ease-out"
        >
          {!failedImages[currentSlide.src] ? (
            <img
              src={currentSlide.src}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              onError={() => markImageFailed(currentSlide.src)}
              className="w-full h-full object-cover scale-110 blur-xl opacity-55 animate-kenburns"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0A2619] via-[#133824] to-[#06160F]" />
          )}
        </div>

        {/* Layer 2: Triptych / Striking visual background showcase */}
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-4 p-3 md:p-8 opacity-75">
          {[prevSlide, currentSlide, nextSlide].map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              className={`relative h-full w-full rounded-2xl overflow-hidden border border-[#E5B84B]/15 transition-all duration-1000 ${
                idx === 1
                  ? 'opacity-100 scale-100 shadow-2xl'
                  : 'hidden md:block opacity-55 scale-95'
              }`}
            >
              {!failedImages[slide.src] ? (
                <img
                  src={slide.src}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  onError={() => markImageFailed(slide.src)}
                  className="w-full h-full object-cover object-center animate-kenburns"
                />
              ) : (
                <div className="w-full h-full bg-[#0B2418]" />
              )}
            </div>
          ))}
        </div>

        {/* Layer 3: Measured Contrast Scrim */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isBackdropSpotlight
              ? 'bg-gradient-to-b from-[#06160F]/60 via-[#06160F]/20 to-[#06160F]/75'
              : 'bg-gradient-to-b from-[#06160F]/88 via-[#06160F]/74 to-[#06160F]/94'
          }`}
        />
      </div>

      {/* =====================================================================
          TOP BAR CONTRACT (Strictly 3 Zones separated by gap-8)
      ===================================================================== */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-8 lg:px-12 py-4 bg-[#06160F]/92 backdrop-blur-md border-b border-[#E5B84B]/30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#topo"
          className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#E5B84B] whitespace-nowrap shrink-0"
        >
          Pequi Ouro do Cerrado
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-lg font-semibold text-[#FAF6EE]">
          <a
            href="#produtos"
            className="hover:text-[#E5B84B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            1. Escolher Pacotes
          </a>
          <a
            href="#fechar-pedido"
            className="hover:text-[#E5B84B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            2. Finalizar no WhatsApp
          </a>
          <a
            href="#galeria-fundo"
            className="hover:text-[#E5B84B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Fotos Reais
          </a>
          <button
            type="button"
            onClick={() => setIsBackdropSpotlight((prev) => !prev)}
            className="hover:text-[#E5B84B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isBackdropSpotlight ? 'Voltar para Loja' : 'Destacar Fundo'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={scrollToCheckout}
            className="flex items-center gap-2.5 px-4 sm:px-6 py-3 text-sm sm:text-lg font-extrabold text-[#06160F] bg-[#E5B84B] hover:bg-[#F0C75E] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-lg"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="tabular-nums">
              {totalPackagesCount > 0
                ? `Fechar Pedido (${totalPackagesCount}) · ${formatCurrency(productsSubtotal)}`
                : 'Fazer Pedido'}
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN SINGLE-PAGE CONTENT (Wider container & Larger Typography)
      ===================================================================== */}
      <main
        id="topo"
        className={`relative z-10 flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 transition-opacity duration-500 ${
          isBackdropSpotlight ? 'opacity-20 hover:opacity-100' : 'opacity-100'
        }`}
      >
        {/* HERO SECTION */}
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[#E5B84B]/30">
            <div className="max-w-3xl">
              <p className="text-base sm:text-xl font-bold text-[#E5B84B] mb-2">
                Primavera do Leste e Região - MT · WhatsApp {WHATSAPP_DISPLAY}
              </p>
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#FAF6EE] leading-[1.08] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Compre seu Pequi em 2 passos simples.
              </h1>
              <p className="mt-4 text-lg sm:text-xl md:text-2xl text-[#FAF6EE]/95 leading-relaxed">
                Escolha abaixo a quantidade de pacotes de{' '}
                <strong className="text-[#E5B84B]">R$ 25</strong>,{' '}
                <strong className="text-[#E5B84B]">R$ 35</strong> ou{' '}
                <strong className="text-[#E5B84B]">R$ 50</strong> e envie seu pedido direto para o
                nosso WhatsApp.
              </p>

              {/* Unboxed Regional Delivery Highlights */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-base sm:text-lg font-bold text-[#E5B84B]">
                <span>Frete Primavera do Leste: R$ 15,00</span>
                <span aria-hidden="true">·</span>
                <span>Retirada no Local: Grátis</span>
                <span aria-hidden="true">·</span>
                <span>Outras Cidades: A combinar</span>
              </div>
            </div>

            {/* Background Carousel Quick Control */}
            <div className="flex items-center justify-between gap-3 bg-[#091E14]/95 border border-[#E5B84B]/35 rounded-2xl p-4 shrink-0">
              <div className="pr-2">
                <div className="text-xs sm:text-sm font-bold text-[#E5B84B] tabular-nums">
                  Fotos passando no fundo ({activeSlideIndex + 1}/{BACKGROUND_CAROUSEL_IMAGES.length})
                </div>
                <div className="text-sm sm:text-base font-bold text-[#FAF6EE] truncate max-w-[200px]">
                  {currentSlide.title}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlideIndex(
                      (prev) =>
                        (prev - 1 + BACKGROUND_CAROUSEL_IMAGES.length) %
                        BACKGROUND_CAROUSEL_IMAGES.length
                    )
                  }
                  aria-label="Foto anterior"
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#102E20] hover:bg-[#18432F] text-[#FAF6EE] cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCarouselPlaying((prev) => !prev)}
                  aria-label={isCarouselPlaying ? 'Pausar fundo' : 'Reproduzir fundo'}
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#102E20] hover:bg-[#18432F] text-[#E5B84B] cursor-pointer"
                >
                  {isCarouselPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlideIndex((prev) => (prev + 1) % BACKGROUND_CAROUSEL_IMAGES.length)
                  }
                  aria-label="Próxima foto"
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#102E20] hover:bg-[#18432F] text-[#FAF6EE] cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            STEP 1: 3 MAIN PRODUCT CARDS (R$ 25, R$ 35, R$ 50 - NO "ESCOLHA O TIPO")
        ===================================================================== */}
        <section id="produtos" className="mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FAF6EE]">
                Passo 1: Escolha os Pacotes e a Quantidade
              </h2>
              <p className="text-base sm:text-lg text-[#E6DEC8] mt-1">
                Toque no botão <strong className="text-[#E5B84B]">+ Adicionar</strong> em quantos
                pacotes quiser levar:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8 items-stretch">
            {PRODUCTS.map((product) => {
              const qty = quantities[product.id] || 0;
              const isSelected = qty > 0;

              return (
                <article
                  key={product.id}
                  className={`flex flex-col justify-between bg-[#091F15]/95 backdrop-blur-md rounded-3xl overflow-hidden transition-all duration-200 shadow-2xl ${
                    isSelected
                      ? 'border-2 border-[#E5B84B] ring-4 ring-[#E5B84B]/25'
                      : 'border border-[#E5B84B]/35'
                  }`}
                >
                  {/* Top Area: Product Image + Clear Info */}
                  <div>
                    <div
                      onClick={() =>
                        setLightboxImage({
                          src: product.image,
                          title: `${product.name} — ${formatCurrency(product.price)}`,
                          subtitle: product.subtitle,
                        })
                      }
                      className="relative aspect-[3/4] w-full bg-[#06160F] overflow-hidden cursor-pointer border-b border-[#E5B84B]/25"
                    >
                      {!failedImages[product.image] ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          onError={() => markImageFailed(product.image)}
                          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0B2418]">
                          <span className="text-2xl font-bold text-[#E5B84B]">{product.name}</span>
                          <span className="text-lg text-[#E6DEC8] mt-1">{product.weight}</span>
                        </div>
                      )}

                      <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-[#06160F]/90 text-sm font-semibold text-[#FAF6EE] border border-[#E5B84B]/35">
                        Ampliar Foto
                      </div>
                    </div>

                    <div className="p-6 pb-4">
                      <div className="text-base sm:text-lg font-bold text-[#E5B84B]">
                        {product.subtitle}
                      </div>

                      <div className="flex items-baseline justify-between gap-3 mt-2">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FAF6EE]">
                          {product.name}
                        </h3>
                      </div>

                      {/* Huge Price Display */}
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#E5B84B]">
                          R$
                        </span>
                        <span className="text-4xl sm:text-5xl font-extrabold text-[#E5B84B] tabular-nums">
                          {product.price},00
                        </span>
                        <span className="text-base sm:text-lg text-[#E6DEC8]/85 ml-1">
                          / {product.weight}
                        </span>
                      </div>

                      <p className="text-base sm:text-lg text-[#FAF6EE]/90 mt-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Super Simple & Didactic Purchase Controls */}
                  <div className="p-6 pt-2 space-y-4">
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-full py-4 px-6 bg-[#E5B84B] hover:bg-[#F0C75E] text-[#06160F] font-extrabold text-lg sm:text-xl rounded-2xl transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
                      >
                        <Plus className="w-6 h-6 shrink-0 stroke-[2.5]" />
                        <span>Adicionar ao Pedido</span>
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-[#06160F] border-2 border-[#E5B84B] rounded-2xl p-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            aria-label="Diminuir quantidade"
                            className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#102E20] hover:bg-[#18432F] text-[#FAF6EE] cursor-pointer"
                          >
                            <Minus className="w-6 h-6 stroke-[2.5]" />
                          </button>

                          <div className="text-center px-2">
                            <div className="text-2xl sm:text-3xl font-extrabold text-[#E5B84B] tabular-nums">
                              {qty} {qty === 1 ? 'pacote' : 'pacotes'}
                            </div>
                            <div className="text-sm sm:text-base font-bold text-[#FAF6EE] tabular-nums">
                              Subtotal: {formatCurrency(product.price * qty)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1)}
                            aria-label="Aumentar quantidade"
                            className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#E5B84B] hover:bg-[#F0C75E] text-[#06160F] cursor-pointer"
                          >
                            <Plus className="w-6 h-6 stroke-[2.5]" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={scrollToCheckout}
                          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base sm:text-lg rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <Check className="w-5 h-5 shrink-0" />
                          <span>Ir para Finalizar Pedido</span>
                          <ArrowDown className="w-5 h-5 shrink-0" />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            STEP 2: DIDACTIC ON-PAGE CHECKOUT (DIRETO PARA O WHATSAPP 66 9954-8221)
        ===================================================================== */}
        <section
          id="fechar-pedido"
          className="mb-12 sm:mb-16 bg-[#081C13]/95 backdrop-blur-md border-2 border-[#E5B84B]/50 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl"
        >
          <div className="border-b border-[#E5B84B]/25 pb-5 mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E5B84B]">
              Passo 2: Confira e Envie seu Pedido no WhatsApp
            </h2>
            <p className="text-base sm:text-xl text-[#FAF6EE]/90 mt-1">
              Preencha abaixo se prefere <strong>Entrega</strong> ou{' '}
              <strong>Retirada no Local</strong> e clique no botão verde para enviar ao WhatsApp{' '}
              <strong>{WHATSAPP_DISPLAY}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Selected Items & Quick Adjustments */}
            <div className="lg:col-span-5 bg-[#06160F] border border-[#E5B84B]/30 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#FAF6EE]">
                Resumo dos Pacotes
              </h3>

              <div className="divide-y divide-[#E5B84B]/20">
                {PRODUCTS.map((product) => {
                  const qty = quantities[product.id] || 0;
                  return (
                    <div
                      key={product.id}
                      className="py-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-16 object-cover rounded-xl border border-[#E5B84B]/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-base sm:text-lg font-extrabold text-[#FAF6EE] truncate">
                            {product.name}
                          </div>
                          <div className="text-sm sm:text-base font-bold text-[#E5B84B] tabular-nums">
                            R$ {product.price},00 · {product.weight}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-[#091F15] border border-[#E5B84B]/35 rounded-xl p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#102E20] text-[#FAF6EE] hover:text-[#E5B84B] font-bold text-lg cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-lg sm:text-xl font-extrabold text-[#FAF6EE] tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#E5B84B] text-[#06160F] font-bold text-lg cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPackagesCount === 0 && (
                <div className="p-4 rounded-xl bg-[#102E20] border border-[#E5B84B]/40 text-base text-[#E5B84B] font-bold text-center">
                  Adicione pelo menos 1 pacote acima usando o botão (+) para liberar o pedido.
                </div>
              )}

              {/* Totals Breakdown */}
              <div className="pt-4 border-t border-[#E5B84B]/25 space-y-2.5 text-base sm:text-lg">
                <div className="flex items-center justify-between text-[#E6DEC8]">
                  <span>Valor dos Pacotes ({totalPackagesCount}):</span>
                  <span className="font-bold tabular-nums">
                    {formatCurrency(productsSubtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#E6DEC8]">
                  <span>
                    {deliveryOption === 'primavera'
                      ? 'Frete (Primavera do Leste):'
                      : deliveryOption === 'retirada'
                      ? 'Retirada no Local:'
                      : 'Frete (Outras Cidades):'}
                  </span>
                  <span className="font-bold text-[#E5B84B] tabular-nums">
                    {deliveryOption === 'primavera'
                      ? formatCurrency(PRIMAVERA_FREIGHT)
                      : deliveryOption === 'retirada'
                      ? 'Grátis (R$ 0,00)'
                      : 'A combinar'}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E5B84B]/30 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#FAF6EE]">
                    Total Final:
                  </span>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#E5B84B] tabular-nums">
                      {formatCurrency(finalOrderTotal)}
                    </span>
                    {deliveryOption === 'outras_cidades' && (
                      <span className="block text-sm text-[#E6DEC8]">+ frete a combinar</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Delivery/Pickup, Address & Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Delivery or Pickup */}
              <div>
                <label className="block text-lg sm:text-xl font-extrabold text-[#FAF6EE] mb-3">
                  A) Como você quer receber seu Pequi?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption('primavera')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      deliveryOption === 'primavera'
                        ? 'bg-[#133824] border-[#E5B84B] text-[#FAF6EE] shadow-lg'
                        : 'bg-[#06160F] border-[#E5B84B]/25 text-[#E6DEC8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Truck className="w-6 h-6 text-[#E5B84B]" />
                      <span className="text-base font-extrabold text-[#E5B84B] tabular-nums">
                        + R$ 15,00
                      </span>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-extrabold">
                        Entrega em Primavera do Leste
                      </div>
                      <div className="text-xs sm:text-sm text-[#E6DEC8]/85 mt-0.5">
                        Entregamos no seu endereço
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryOption('retirada')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      deliveryOption === 'retirada'
                        ? 'bg-[#133824] border-[#E5B84B] text-[#FAF6EE] shadow-lg'
                        : 'bg-[#06160F] border-[#E5B84B]/25 text-[#E6DEC8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Store className="w-6 h-6 text-[#E5B84B]" />
                      <span className="text-base font-extrabold text-emerald-400">Grátis</span>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-extrabold">Retirada no Local</div>
                      <div className="text-xs sm:text-sm text-[#E6DEC8]/85 mt-0.5">
                        Retirar em Primavera do Leste
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryOption('outras_cidades')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      deliveryOption === 'outras_cidades'
                        ? 'bg-[#133824] border-[#E5B84B] text-[#FAF6EE] shadow-lg'
                        : 'bg-[#06160F] border-[#E5B84B]/25 text-[#E6DEC8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <MapPin className="w-6 h-6 text-[#E5B84B]" />
                      <span className="text-sm font-extrabold text-[#E5B84B]">A combinar</span>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-extrabold">
                        Outras Cidades (MT)
                      </div>
                      <div className="text-xs sm:text-sm text-[#E6DEC8]/85 mt-0.5">
                        Frete combinado no WhatsApp
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Customer Name & Address */}
              <div className="space-y-4">
                <label className="block text-lg sm:text-xl font-extrabold text-[#FAF6EE]">
                  B) Informe seu Nome{' '}
                  {deliveryOption !== 'retirada' ? 'e Endereço de Entrega' : 'para Retirada'}
                </label>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-[#E6DEC8] mb-1.5">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full px-4 py-3.5 text-lg rounded-xl bg-[#06160F] border-2 border-[#E5B84B]/35 text-[#FAF6EE] placeholder:text-[#E6DEC8]/45 focus:outline-none focus:border-[#E5B84B]"
                  />
                </div>

                {deliveryOption === 'retirada' ? (
                  <div className="p-4 rounded-xl bg-[#102E20] border border-[#E5B84B]/35 text-base sm:text-lg text-[#FAF6EE]">
                    Você selecionou <strong>Retirada no Local (Grátis)</strong>. Combinaremos o
                    horário e ponto exato de retirada pelo WhatsApp!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {deliveryOption === 'outras_cidades' && (
                      <div className="sm:col-span-2">
                        <label className="block text-sm sm:text-base font-bold text-[#E6DEC8] mb-1.5">
                          Sua Cidade em MT *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerCity}
                          onChange={(e) => setCustomerCity(e.target.value)}
                          placeholder="Ex.: Campo Verde, Rondonópolis, Poxoréu..."
                          className="w-full px-4 py-3.5 text-lg rounded-xl bg-[#06160F] border-2 border-[#E5B84B]/35 text-[#FAF6EE] placeholder:text-[#E6DEC8]/45 focus:outline-none focus:border-[#E5B84B]"
                        />
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-bold text-[#E6DEC8] mb-1.5">
                        Endereço de Entrega (Rua e Número) *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Ex.: Av. Cuiabá, Nº 450"
                        className="w-full px-4 py-3.5 text-lg rounded-xl bg-[#06160F] border-2 border-[#E5B84B]/35 text-[#FAF6EE] placeholder:text-[#E6DEC8]/45 focus:outline-none focus:border-[#E5B84B]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-bold text-[#E6DEC8] mb-1.5">
                        Bairro e Ponto de Referência
                      </label>
                      <input
                        type="text"
                        value={customerNeighborhood}
                        onChange={(e) => setCustomerNeighborhood(e.target.value)}
                        placeholder="Ex.: Bairro Centro, perto da farmácia"
                        className="w-full px-4 py-3.5 text-lg rounded-xl bg-[#06160F] border-2 border-[#E5B84B]/35 text-[#FAF6EE] placeholder:text-[#E6DEC8]/45 focus:outline-none focus:border-[#E5B84B]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm sm:text-base font-bold text-[#E6DEC8] mb-1.5">
                    Alguma observação? (opcional)
                  </label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Ex.: Preciso de troco para R$ 100 / Entregar à tarde"
                    className="w-full px-4 py-3 text-base sm:text-lg rounded-xl bg-[#06160F] border border-[#E5B84B]/30 text-[#FAF6EE] placeholder:text-[#E6DEC8]/45 focus:outline-none focus:border-[#E5B84B]"
                  />
                </div>
              </div>

              {/* 3. Payment Method */}
              <div>
                <label className="block text-lg sm:text-xl font-extrabold text-[#FAF6EE] mb-3">
                  C) Forma de Pagamento
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['PIX', 'Cartão', 'Dinheiro'] as PaymentOption[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3.5 px-3 text-base sm:text-lg font-extrabold rounded-xl border-2 transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-[#E5B84B] text-[#06160F] border-[#E5B84B] shadow-md'
                          : 'bg-[#06160F] text-[#FAF6EE] border-[#E5B84B]/30 hover:border-[#E5B84B]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Final WhatsApp Button */}
              <div className="pt-2 space-y-3">
                {!isOrderReady() && (
                  <div className="p-3.5 rounded-xl bg-[#06160F] border border-[#E5B84B]/40 text-sm sm:text-base text-[#E5B84B] font-bold text-center">
                    {totalPackagesCount === 0
                      ? '1º Escolha a quantidade de pacotes nos produtos acima.'
                      : !customerName.trim()
                      ? '2º Digite seu nome para identificar seu pedido.'
                      : '3º Preencha seu endereço de entrega para enviar no WhatsApp.'}
                  </div>
                )}

                <a
                  href={isOrderReady() ? whatsappUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!isOrderReady()) {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full py-5 px-6 rounded-2xl font-extrabold text-lg sm:text-2xl flex items-center justify-center gap-3 transition-all shadow-xl ${
                    isOrderReady()
                      ? 'bg-[#25D366] hover:bg-[#20BD5A] text-[#04140A] cursor-pointer'
                      : 'bg-[#102E20] text-[#E6DEC8]/50 border border-[#E5B84B]/20 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="w-7 h-7 shrink-0" />
                  <span>
                    Enviar Pedido no WhatsApp ({formatCurrency(finalOrderTotal)})
                  </span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyOrderText}
                  className="w-full py-3 px-4 rounded-xl bg-[#102E20] hover:bg-[#173F2C] border border-[#E5B84B]/30 text-sm sm:text-base font-bold text-[#FAF6EE] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-400" />
                      <span>Pedido copiado! Envie para {WHATSAPP_DISPLAY}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copiar texto do pedido ({WHATSAPP_DISPLAY})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            INTERACTIVE FILMSTRIP OF THE 18 BACKGROUND CAROUSEL IMAGES
        ===================================================================== */}
        <section
          id="galeria-fundo"
          className="bg-[#091F15]/95 backdrop-blur-md border border-[#E5B84B]/30 rounded-3xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF6EE]">
                Fotos Reais — Pequi Ouro do Cerrado
              </h2>
              <p className="text-base sm:text-lg text-[#E6DEC8] mt-1">
                Toque em qualquer foto abaixo para colocá-la no fundo ou ampliar:
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsBackdropSpotlight((prev) => !prev)}
                className="px-4 py-3 text-base font-bold rounded-xl bg-[#102E20] hover:bg-[#18432F] text-[#FAF6EE] border border-[#E5B84B]/35 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Eye className="w-5 h-5 text-[#E5B84B]" />
                <span>{isBackdropSpotlight ? 'Mostrar Loja' : 'Destacar Fundo'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxImage({
                    src: currentSlide.src,
                    title: currentSlide.title,
                    subtitle: currentSlide.caption,
                  })
                }
                className="px-4 py-3 text-base font-bold rounded-xl bg-[#E5B84B] text-[#06160F] transition-colors cursor-pointer"
              >
                Ampliar Foto Atual
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3">
            {BACKGROUND_CAROUSEL_IMAGES.map((slide, index) => {
              const isActive = index === activeSlideIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(index)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#E5B84B] ring-3 ring-[#E5B84B]/80 scale-[1.03]'
                      : 'border-white/20 opacity-75 hover:opacity-100'
                  }`}
                >
                  {!failedImages[slide.src] ? (
                    <img
                      src={slide.src}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed(slide.src)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#102E20] flex items-center justify-center text-sm text-[#E5B84B]">
                      #{slide.id}
                    </div>
                  )}
                  <span className="sr-only">{slide.title}</span>
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-xs font-bold tabular-nums text-[#FAF6EE]">
                    {index + 1}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* =====================================================================
          MOBILE STICKY BOTTOM BAR (Quick jump to finish order)
      ===================================================================== */}
      {totalPackagesCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#081C13]/98 backdrop-blur-md border-t-2 border-[#E5B84B] px-4 py-3 shadow-2xl">
          <button
            type="button"
            onClick={scrollToCheckout}
            className="w-full py-3.5 px-5 bg-[#E5B84B] text-[#06160F] font-extrabold text-lg rounded-xl flex items-center justify-between shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 shrink-0" />
              <span>Finalizar ({totalPackagesCount} pac.)</span>
            </div>
            <div className="flex items-center gap-2 tabular-nums font-extrabold">
              <span>{formatCurrency(productsSubtotal)}</span>
              <ArrowDown className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* =====================================================================
          QUIET FOOTER
      ===================================================================== */}
      <footer className="relative z-10 border-t border-[#E5B84B]/25 bg-[#06160F]/95 backdrop-blur-md px-4 sm:px-8 lg:px-12 py-6 text-base sm:text-lg text-[#E6DEC8]">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 font-semibold">
            <span className="font-extrabold text-[#E5B84B]">Pequi Ouro do Cerrado</span>
            <span aria-hidden="true">·</span>
            <span>Primavera do Leste e Região - MT</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">WhatsApp: {WHATSAPP_DISPLAY}</span>
          </div>
          <div className="font-semibold">
            <span>Comercial R$ 25 · Gigante R$ 35 · Super Gigante R$ 50</span>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          IMAGE LIGHTBOX MODAL
      ===================================================================== */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-[#081C13] border-2 border-[#E5B84B]/50 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5B84B]/25">
              <div>
                <h3 className="text-xl font-extrabold text-[#FAF6EE]">{lightboxImage.title}</h3>
                <p className="text-base font-semibold text-[#E5B84B]">{lightboxImage.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="w-11 h-11 rounded-xl bg-[#102E20] flex items-center justify-center text-[#FAF6EE] hover:text-[#E5B84B] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto bg-[#06160F] flex items-center justify-center p-2">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
