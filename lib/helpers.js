const mapMeta = (mapFn) => (info) => {
    if (!info) {
        return info;
    }

    const meta = info.meta;
    if (!meta) {
        return info;
    }

    if (Array.isArray(meta)) {
        // eslint-disable-next-line no-param-reassign
        info.meta = meta.map(mapFn);
    } else {
        // eslint-disable-next-line no-param-reassign
        info.meta = mapFn(meta);
    }

    return info;
};

module.exports = {
    mapMeta,
};
