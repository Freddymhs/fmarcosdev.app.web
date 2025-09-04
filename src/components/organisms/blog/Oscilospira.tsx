import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Article } from "./blog";

const HelicalScrollCards = ({
  hiddenReposition = true,
  articles = [],
}: {
  hiddenReposition?: boolean;
  articles?: Article[];
  filterHeight?: number; // Add type definition
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [, setScrollPosition] = useState(0);
  const [hiddenCards, setHiddenCards] = useState<Set<number>>(new Set());
  const scrollOffsetRef = useRef(0);
  const targetScrollRef = useRef(0);
  const cardsRef = useRef<THREE.Mesh[]>([]);
  const pointsRef = useRef<THREE.Vector3[]>([]);
  const animationFrameIdRef = useRef<number>();
  const textureCacheRef = useRef<Map<string, THREE.CanvasTexture>>(new Map());
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const configRef = useRef({
    turns: 4,
    segments: 100,
    heightSpan: 8, // Valor más generoso ahora que no hay padding-bottom
    cardCount: Math.max(articles.length, 1),
    scrollSensitivity: 0.15,
    transitionThreshold: 0.95,
  });

  useEffect(() => {
    if (!mountRef.current) return;

    // Limpiar contenido previo
    mountRef.current.innerHTML = "";

    // Obtener dimensiones del contenedor
    const updateSize = () => {
      const rect = mountRef.current!.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
      };
    };

    let { width, height } = updateSize();

    const dynamicHeightSpan = Math.min(10, Math.max(6, height / 80));
    configRef.current.heightSpan = dynamicHeightSpan;

    // Setup escena
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Posicionar la cámara más centrada verticalmente para mejor visualización
    const cameraY = configRef.current.heightSpan * 0.4; // Cambiado de /2 a *0.4 para enfocar más arriba
    // Hacer el radio adaptable al ancho del contenedor
    const radius = Math.max(3, width / 200);
    const cameraDistance = Math.max(radius * 2, 15);
    camera.position.set(0, cameraY, cameraDistance);
    camera.lookAt(0, cameraY, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    // ✅ Configurar el canvas para que use 100% del espacio
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Generar puntos de la hélice
    const { turns, segments, heightSpan, cardCount } = configRef.current;
    // Hacer el radio adaptable al ancho del contenedor (radius ya definido arriba)

    const points = Array.from({ length: segments }, (_, i) => {
      const theta = (i / segments) * turns * Math.PI * 2;
      return new THREE.Vector3(
        radius * Math.cos(theta),
        (i / segments) * heightSpan,
        radius * Math.sin(theta)
      );
    });

    // Agregar línea de trayectoria
    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0x2563eb, linewidth: 2 })
      )
    );

    // Crear tarjetas con números
    const cards = Array.from({ length: cardCount }, (_, i) => {
      const idx = Math.floor((i / cardCount) * segments);
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.5, 0.1),
        new THREE.MeshPhongMaterial({ color: 0xdc2626, shininess: 50 })
      );
      card.position.copy(points[idx]);

      // Canvas para contenido del artículo (formato badge evento) with caching
      const cacheKey = `${articles[i]?.id || i}-${
        articles[i]?.Title || "default"
      }`;
      let texture = textureCacheRef.current.get(cacheKey);

      if (!texture) {
        const canvas = Object.assign(document.createElement("canvas"), {
          width: 200,
          height: 320,
        });
        const ctx = canvas.getContext("2d");
        const article = articles[i];

        // Fondo con gradiente vertical (estilo badge de evento)
        const gradient = ctx.createLinearGradient(0, 0, 0, 320);
        gradient.addColorStop(0, "#1e40af"); // Azul oscuro arriba
        gradient.addColorStop(0.7, "#3b82f6"); // Azul claro medio
        gradient.addColorStop(1, "#1e40af"); // Azul oscuro abajo
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 320);

        // Borde del badge
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 3;
        ctx.strokeRect(3, 3, 194, 314);

        // Header del badge con ID
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(0, 0, 200, 50);
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`ARTICLE #${article?.id || i + 1}`, 100, 30);

        // Título del artículo (multi-línea vertical)
        const title = article?.Title || `Article ${i + 1}`;
        const maxLength = 18;

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";

        // Dividir título en múltiples líneas para formato vertical
        const words = title.split(" ");
        const lines = [];
        let currentLine = "";

        for (let word of words) {
          if ((currentLine + " " + word).length < maxLength) {
            currentLine += (currentLine ? " " : "") + word;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) lines.push(currentLine);

        // Mostrar hasta 4 líneas de título
        const startY = 80;
        lines.slice(0, 4).forEach((line, index) => {
          ctx.fillText(line, 100, startY + index * 25);
        });

        // Fecha de publicación prominente
        if (article?.publishedAt) {
          const date = new Date(article.publishedAt);
          const day = date.getDate().toString().padStart(2, "0");
          const month = date
            .toLocaleDateString("es-ES", { month: "short" })
            .toUpperCase();
          const year = date.getFullYear();

          // Sección de fecha
          ctx.fillStyle = "#1e3a8a";
          ctx.fillRect(10, 220, 180, 60);

          // Día grande
          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(day, 100, 245);

          // Mes y año
          ctx.fillStyle = "#e5e7eb";
          ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText(`${month} ${year}`, 100, 265);
        }

        // Footer con decoración
        ctx.fillStyle = "#374151";
        ctx.fillRect(0, 290, 200, 30);
        ctx.fillStyle = "#9ca3af";
        ctx.font = "10px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BLOG ARTICLE", 100, 308);

        texture = new THREE.CanvasTexture(canvas);
        textureCacheRef.current.set(cacheKey, texture);
      }

      const numberPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 4.0),
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        } as THREE.MeshBasicMaterialParameters)
      );
      numberPlane.position.z = 0.06;
      card.add(numberPlane);

      card.userData = { index: i };
      scene.add(card);
      return card;
    });

    cardsRef.current = cards;
    pointsRef.current = points;

    // Iluminación
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Event handlers
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetScrollRef.current +=
        (e.deltaY > 0 ? 1 : -1) * configRef.current.scrollSensitivity;
    };

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current)
        return;

      const { width: newWidth, height: newHeight } = updateSize();

      // Recalcular heightSpan dinámicamente usando toda la altura disponible
      const newHeightSpan = Math.min(10, Math.max(6, newHeight / 80));
      configRef.current.heightSpan = newHeightSpan;

      // Recalcular radio y puntos de la hélice
      const newRadius = Math.max(3, newWidth / 200);
      const { turns, segments, cardCount } = configRef.current;
      const heightSpan = newHeightSpan;
      const newPoints = Array.from({ length: segments }, (_, i) => {
        const theta = (i / segments) * turns * Math.PI * 2;
        return new THREE.Vector3(
          newRadius * Math.cos(theta),
          (i / segments) * heightSpan,
          newRadius * Math.sin(theta)
        );
      });

      // Actualizar línea de trayectoria
      const oldLine = scene.children.find(
        (child) => child instanceof THREE.Line
      );
      if (oldLine) scene.remove(oldLine);
      scene.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(newPoints),
          new THREE.LineBasicMaterial({ color: 0x2563eb, linewidth: 2 })
        )
      );

      // Actualizar posiciones de las tarjetas
      cardsRef.current.forEach((card, index) => {
        const idx = Math.floor((index / cardCount) * segments);
        if (newPoints[idx]) {
          card.position.copy(newPoints[idx]);
        }
      });

      pointsRef.current = newPoints;

      cameraRef.current.aspect = newWidth / newHeight;
      // Actualizar posición de la cámara basada en el nuevo radio y heightSpan
      const newCameraDistance = Math.max(newRadius * 2, 15);
      const newCameraY = newHeightSpan * 0.4; // Mantener la misma proporción
      cameraRef.current.position.set(0, newCameraY, newCameraDistance);
      cameraRef.current.lookAt(0, newCameraY, 0);
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    // ✅ Usar ResizeObserver para detectar cambios de tamaño más precisos with debouncing
    const resizeObserver = new ResizeObserver((entries) => {
      // Clear previous timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Debounce the resize handler
      resizeTimeoutRef.current = setTimeout(() => {
        for (let entry of entries) {
          const { width: newWidth, height: newHeight } = entry.contentRect;
          if (rendererRef.current && cameraRef.current) {
            // Recalcular heightSpan dinámicamente usando toda la altura disponible
            const newHeightSpan = Math.min(10, Math.max(6, newHeight / 80));
            configRef.current.heightSpan = newHeightSpan;

            // Recalcular radio y puntos de la hélice
            const newRadius = Math.max(3, newWidth / 200);
            const { turns, segments, cardCount } = configRef.current;
            const heightSpan = newHeightSpan;
            const newPoints = Array.from({ length: segments }, (_, i) => {
              const theta = (i / segments) * turns * Math.PI * 2;
              return new THREE.Vector3(
                newRadius * Math.cos(theta),
                (i / segments) * heightSpan,
                newRadius * Math.sin(theta)
              );
            });

            // Actualizar línea de trayectoria
            const oldLine = scene.children.find(
              (child) => child instanceof THREE.Line
            );
            if (oldLine) scene.remove(oldLine);
            scene.add(
              new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(newPoints),
                new THREE.LineBasicMaterial({ color: 0x2563eb, linewidth: 2 })
              )
            );

            // Actualizar posiciones de las tarjetas
            cardsRef.current.forEach((card, index) => {
              const idx = Math.floor((index / cardCount) * segments);
              if (newPoints[idx]) {
                card.position.copy(newPoints[idx]);
              }
            });

            pointsRef.current = newPoints;

            cameraRef.current.aspect = newWidth / newHeight;
            // Actualizar posición de la cámara basada en el nuevo radio
            const newCameraDistance = Math.max(newRadius * 2, 15);
            cameraRef.current.position.z = newCameraDistance;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(newWidth, newHeight);
          }
        }
      }, 100); // 100ms debounce
    });

    resizeObserver.observe(mountRef.current);

    // Función para detectar si una tarjeta está en transición
    const isCardInTransition = (normalizedPos: number) => {
      const threshold = configRef.current.transitionThreshold;
      return normalizedPos > threshold || normalizedPos < 1 - threshold;
    };

    // Optimized Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      // Early exit if no significant change
      const delta = Math.abs(targetScrollRef.current - scrollOffsetRef.current);
      if (delta < 0.001) {
        // Skip unnecessary updates if scroll position is stable
      }

      scrollOffsetRef.current +=
        (targetScrollRef.current - scrollOffsetRef.current) * 0.08;
      setScrollPosition(scrollOffsetRef.current);

      // Only update cards if there are cards to update
      if (cardsRef.current.length > 0) {
        const newHiddenCards = new Set<number>();

        cardsRef.current.forEach((card, index) => {
          let pos =
            ((index / configRef.current.cardCount) *
              configRef.current.segments +
              scrollOffsetRef.current) %
            configRef.current.segments;
          if (pos < 0) pos += configRef.current.segments;

          const posIdx = Math.floor(pos);
          const nextIdx = (posIdx + 1) % pointsRef.current.length;
          const fraction = pos - posIdx;

          const normalizedPos = pos / configRef.current.segments;
          const shouldHide =
            hiddenReposition && isCardInTransition(normalizedPos);

          if (shouldHide) {
            newHiddenCards.add(index);
            card.visible = false;
          } else {
            card.visible = true;

            card.position.copy(
              new THREE.Vector3().lerpVectors(
                pointsRef.current[posIdx],
                pointsRef.current[nextIdx],
                fraction
              )
            );

            const tangent = new THREE.Vector3()
              .subVectors(pointsRef.current[nextIdx], pointsRef.current[posIdx])
              .normalize();

            const lookDirection = new THREE.Vector3()
              .subVectors(camera.position, card.position)
              .normalize();
            card.lookAt(card.position.clone().add(lookDirection));

            card.rotateX(
              Math.atan2(
                tangent.y,
                Math.sqrt(tangent.x * tangent.x + tangent.z * tangent.z)
              )
            );

            if (hiddenCards.has(index) && !shouldHide) {
              card.material.opacity = 0;
              const fadeIn = () => {
                if (card.material) {
                  card.material.opacity = Math.min(
                    1,
                    card.material.opacity + 0.05
                  );
                  if (card.material.opacity < 1) {
                    requestAnimationFrame(fadeIn);
                  }
                }
              };
              fadeIn();
            }
          }
        });

        setHiddenCards(newHiddenCards);
      }

      renderer.render(scene, camera);
    };

    // Setup eventos
    mountRef.current.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener("wheel", handleWheel);
      }

      // Cancel animation frame
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      // Clear resize timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Clear resize observer
      resizeObserver.disconnect();

      // Dispose of Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // Dispose of geometries and materials
      cardsRef.current.forEach((card) => {
        if (card.geometry) card.geometry.dispose();
        if (card.material) {
          if (card.material.map) card.material.map.dispose();
          card.material.dispose();
        }
        // Dispose of the child plane geometry and material
        card.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (child.material.map) child.material.map.dispose();
              child.material.dispose();
            }
          }
        });
      });

      // Dispose of line geometry and material
      const line = scene.children.find((child) => child instanceof THREE.Line);
      if (line) {
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
      }

      // Clear texture cache
      textureCacheRef.current.clear();
    };
  }, [hiddenReposition]);

  return (
    <div
      className="w-full border-2 border-red-400 flex-1 z-100"
      style={{
        // Responsive: usar flex-1 y altura mínima conservadora para no invadir footer
        minHeight: "300px", // Reducida para respetar el footer
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={mountRef}
        className="w-full h-full flex-1 border border-red-300"
        style={{
          position: "relative",
        }}
      ></div>
    </div>
  );
};

export default HelicalScrollCards;
