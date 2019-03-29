const mapMeta = (mapFn) => (info) => {
    if (!info) {
        return info;
    }

    const meta = info.meta;
    if (!meta) {
        return info;
    }

    if (Array.isArray(meta)) {
        info.meta = meta.map(mapFn);
    } else {
        info.meta = mapFn(meta);
    }

    return info;
};

module.exports = {
    mapMeta,
};
