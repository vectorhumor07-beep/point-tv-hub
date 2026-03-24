import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import {
  XtreamCredentials,
  XtreamCategory,
  XtreamLiveStream,
  XtreamVodStream,
  XtreamSeriesItem,
  getLiveCategories,
  getLiveStreams,
  getVodCategories,
  getVodStreams,
  getSeriesCategories,
  getSeriesStreams,
  getVodInfo,
  getSeriesInfo,
  getShortEPG,
  XtreamVodInfo,
  XtreamSeriesInfo,
  XtreamEPGItem,
} from '@/services/xtreamApi';

export const useXtreamLive = () => {
  const { xtreamCreds, isXtreamMode } = useApp();
  const [categories, setCategories] = useState<XtreamCategory[]>([]);
  const [streams, setStreams] = useState<XtreamLiveStream[]>([]);
  const [loading, setLoading] = useState(isXtreamMode && !!xtreamCreds);

  useEffect(() => {
    if (!isXtreamMode || !xtreamCreds) return;
    setLoading(true);
    Promise.all([
      getLiveCategories(xtreamCreds),
      getLiveStreams(xtreamCreds),
    ]).then(([cats, strs]) => {
      setCategories(cats || []);
      setStreams(strs || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [xtreamCreds, isXtreamMode]);

  return { categories, streams, loading };
};

export const useXtreamVod = () => {
  const { xtreamCreds, isXtreamMode } = useApp();
  const [categories, setCategories] = useState<XtreamCategory[]>([]);
  const [streams, setStreams] = useState<XtreamVodStream[]>([]);
  const [loading, setLoading] = useState(isXtreamMode && !!xtreamCreds);

  useEffect(() => {
    if (!isXtreamMode || !xtreamCreds) return;
    setLoading(true);
    Promise.all([
      getVodCategories(xtreamCreds),
      getVodStreams(xtreamCreds),
    ]).then(([cats, strs]) => {
      setCategories(cats || []);
      setStreams(strs || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [xtreamCreds, isXtreamMode]);

  return { categories, streams, loading };
};

export const useXtreamSeries = () => {
  const { xtreamCreds, isXtreamMode } = useApp();
  const [categories, setCategories] = useState<XtreamCategory[]>([]);
  const [streams, setStreams] = useState<XtreamSeriesItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isXtreamMode || !xtreamCreds) return;
    setLoading(true);
    Promise.all([
      getSeriesCategories(xtreamCreds),
      getSeriesStreams(xtreamCreds),
    ]).then(([cats, strs]) => {
      setCategories(cats || []);
      setStreams(strs || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [xtreamCreds, isXtreamMode]);

  return { categories, streams, loading };
};

export const useXtreamVodInfo = (vodId: number | null) => {
  const { xtreamCreds, isXtreamMode } = useApp();
  const [info, setInfo] = useState<XtreamVodInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isXtreamMode || !xtreamCreds || !vodId) return;
    setLoading(true);
    getVodInfo(xtreamCreds, vodId)
      .then(setInfo)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [xtreamCreds, isXtreamMode, vodId]);

  return { info, loading };
};

export const useXtreamSeriesInfo = (seriesId: number | null) => {
  const { xtreamCreds, isXtreamMode } = useApp();
  const [info, setInfo] = useState<XtreamSeriesInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isXtreamMode || !xtreamCreds || !seriesId) return;
    setLoading(true);
    getSeriesInfo(xtreamCreds, seriesId)
      .then(setInfo)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [xtreamCreds, isXtreamMode, seriesId]);

  return { info, loading };
};

export const useXtreamEPG = (streamId: number | null) => {
  const { xtreamCreds, isXtreamMode } = useApp();
  const [epg, setEpg] = useState<XtreamEPGItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isXtreamMode || !xtreamCreds || !streamId) return;
    setLoading(true);
    getShortEPG(xtreamCreds, streamId)
      .then(data => setEpg(data?.epg_listings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [xtreamCreds, isXtreamMode, streamId]);

  return { epg, loading };
};
