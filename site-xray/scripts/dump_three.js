async () => {
  const X = window.__xr, sel = X.sel;
  const r3 = (v) => v ? [v.x, v.y, v.z].map((n) => +(+n).toFixed(3)) : null;
  const col = (c) => c && c.getHexString ? '#' + c.getHexString() : c;
  const renderers = X.three.filter((o) => o && o.domElement && o.render);
  const scenes = X.three.filter((o) => o && o.isScene);
  // Catch the camera each renderer draws with
  renderers.forEach((r) => { if (!r.__xrWrapped) { const f = r.render.bind(r); r.render = (s, c) => { r.__xrCam = c; r.__xrScene = s; r.__xrFrames = (r.__xrFrames || 0) + 1; return f(s, c); }; r.__xrWrapped = 1; } });
  await new Promise((res) => setTimeout(res, 1500));
  const mat = (m) => {
    if (!m) return null;
    if (Array.isArray(m)) return m.map(mat);
    const o = { type: m.type, name: m.name || undefined, color: col(m.color), emissive: col(m.emissive), roughness: m.roughness, metalness: m.metalness, transmission: m.transmission, thickness: m.thickness, ior: m.ior, clearcoat: m.clearcoat, clearcoatRoughness: m.clearcoatRoughness, sheen: m.sheen, iridescence: m.iridescence, opacity: m.opacity, transparent: m.transparent, side: m.side, envMapIntensity: m.envMapIntensity, depthWrite: m.depthWrite, blending: m.blending, wireframe: m.wireframe || undefined };
    const maps = []; for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'alphaMap', 'emissiveMap', 'aoMap', 'envMap', 'transmissionMap', 'bumpMap', 'displacementMap']) if (m[k]) { const img = m[k].image || m[k].source && m[k].source.data; maps.push(k + ':' + (img ? (img.currentSrc || img.src || '').split('/').pop().slice(0, 60) || ((img.width || '?') + 'x' + (img.height || '?') + (img.tagName ? ' ' + img.tagName : '')) : '')); }
    if (maps.length) o.maps = maps;
    if (m.vertexShader || m.fragmentShader) { o.shader = { vLen: (m.vertexShader || '').length, fLen: (m.fragmentShader || '').length, uniforms: Object.fromEntries(Object.entries(m.uniforms || {}).map(([k, u]) => [k, u && u.value !== undefined ? (typeof u.value === 'number' ? +u.value.toFixed(4) : u.value && u.value.isColor ? col(u.value) : u.value && u.value.isVector2 ? [u.value.x, u.value.y] : u.value && u.value.isVector3 ? r3(u.value) : u.value && u.value.isTexture ? 'texture' : typeof u.value) : null])) }; o.__v = m.vertexShader; o.__f = m.fragmentShader; }
    if (m.onBeforeCompile && String(m.onBeforeCompile).length > 30 && !/^onBeforeCompile\(\)\{\}/.test(String(m.onBeforeCompile))) o.onBeforeCompile = String(m.onBeforeCompile).slice(0, 600);
    Object.keys(o).forEach((k) => o[k] === undefined && delete o[k]);
    return o;
  };
  const shaders = [];
  const node = (n, depth) => {
    const o = { type: n.type, name: n.name || undefined, pos: r3(n.position), rot: r3(n.rotation), scale: r3(n.scale), visible: n.visible };
    if (n.geometry) { const g = n.geometry; o.geo = g.type + ' v=' + (g.attributes && g.attributes.position ? g.attributes.position.count : '?') + (g.parameters ? ' ' + JSON.stringify(g.parameters).slice(0, 120) : '') + (g.attributes && g.attributes.uv ? ' uv' : ''); }
    if (n.material) { o.mat = mat(n.material); const ms = Array.isArray(o.mat) ? o.mat : [o.mat]; ms.forEach((m) => { if (m && m.__v) { shaders.push({ owner: (n.name || n.type), type: m.type, vertex: m.__v, fragment: m.__f, uniforms: m.shader.uniforms }); } if (m) { delete m.__v; delete m.__f; } }); }
    if (n.isLight) o.light = { color: col(n.color), intensity: n.intensity, castShadow: n.castShadow, distance: n.distance, angle: n.angle, penumbra: n.penumbra, groundColor: col(n.groundColor), target: n.target ? r3(n.target.position) : undefined, shadowMapSize: n.shadow ? n.shadow.mapSize.x : undefined, shadowRadius: n.shadow ? n.shadow.radius : undefined };
    if (n.isInstancedMesh) o.instances = n.count;
    if (n.isPoints) o.points = n.geometry && n.geometry.attributes.position.count;
    if (n.children && n.children.length && depth < 8) o.children = n.children.slice(0, 60).map((c) => node(c, depth + 1));
    Object.keys(o).forEach((k) => o[k] === undefined && delete o[k]);
    return o;
  };
  const out = renderers.map((r, i) => {
    const el = r.domElement, rect = el.getBoundingClientRect();
    const cam = r.__xrCam, sc = r.__xrScene || scenes[i];
    const tm = ['None', 'Linear', 'Reinhard', 'Cineon', 'ACESFilmic', 'Custom', 'AgX', 'Neutral'];
    return {
      i, canvas: { top: Math.round(rect.top + scrollY), w: Math.round(rect.width), h: Math.round(rect.height), px: el.width + 'x' + el.height, parent: sel(el.parentElement && el.parentElement.parentElement), section: (el.closest('section') || {}).id },
      pixelRatio: r.getPixelRatio(), toneMapping: tm[r.toneMapping] || r.toneMapping, exposure: r.toneMappingExposure, colorSpace: r.outputColorSpace, shadows: r.shadowMap && { enabled: r.shadowMap.enabled, type: r.shadowMap.type }, clearAlpha: r.getClearAlpha(), framesIn1500ms: r.__xrFrames || 0,
      info: r.info && { calls: r.info.render.calls, triangles: r.info.render.triangles, geometries: r.info.memory.geometries, textures: r.info.memory.textures, programs: r.info.programs && r.info.programs.length },
      camera: cam && { type: cam.type, fov: cam.fov, zoom: cam.zoom, near: cam.near, far: cam.far, pos: r3(cam.position), rot: r3(cam.rotation), left: cam.left, right: cam.right },
      scene: sc ? { bg: sc.background && (sc.background.isColor ? col(sc.background) : 'texture'), env: sc.environment ? 'texture ' + (sc.environment.mapping || '') : null, fog: sc.fog && { color: col(sc.fog.color), near: sc.fog.near, far: sc.fog.far, density: sc.fog.density }, graph: node(sc, 0) } : null,
    };
  });
  return { renderers: out, sceneCount: scenes.length, shaders, uniformWrites: Object.fromEntries(Object.entries(X.uniformWrites).filter(([k, v]) => v.distinct > 2).slice(0, 80).map(([k, v]) => [k, { count: v.count, distinct: v.distinct, first: v.first, last: v.last }])), rawShaderSources: X.shaders.length, canvases2d: X.canvases.filter((c) => c.type === '2d') };
}
