import React from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  Sprout,
  MapPin,
  GitCompare,
  ShieldAlert,
  ArrowRight,
  Cpu,
  Layers,
} from 'lucide-react';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-blue-600 text-white shadow">
              <CloudSun className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-none">
                GramVayu
              </span>
              <span className="text-xs font-medium text-emerald-700">
                Block-to-Panchayat Weather Downscaling & Agro-Advisory
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
            >
              Farmer Registration
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <Cpu className="h-4 w-4" />
              Smart India Hackathon Prototype • Agro-Meteorological Decision Support
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              High-Resolution Weather Downscaling from{' '}
              <span className="text-emerald-400">Block Level</span> to{' '}
              <span className="text-blue-300">Gram Panchayat Level</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              Inferring hyper-local Panchayat micro-climate forecasts (temperature,
              rainfall, humidity, wind speed, and risk thresholds) from Block-level
              meteorological bulletins to empower actionable, crop-specific
              agricultural advisories.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg"
              >
                Explore Live Prototype
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Register as Farmer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <PrototypeDisclaimer />
      </div>

      {/* Key Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900">
            End-to-End Agro-Meteorological Architecture
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Designed with a modular service layer so future Python/FastAPI AI/ML
            downscaling models can be plugged in seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <GitCompare className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Block-to-Panchayat Downscaling
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Translates coarse Block-level weather parameters into deterministic
              Panchayat micro-climate forecasts using elevation, vegetation canopy,
              and spatial coordinates.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Sprout className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Crop-Specific Agro Advisories
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Agriculture Officers publish targeted irrigation, sowing, harvesting,
              and pest management advisories tailored to each Panchayat’s forecast.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Interactive GIS Risk Map
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Visualizes Block boundaries and Panchayat markers color-coded by
              rule-based weather risk severity (Normal, Moderate, High, Severe).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Automated Weather Risk Engine
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Evaluates heavy rain (&gt;50 mm), extreme flood risk (&gt;80 mm), heat
              stress (&gt;40°C), and strong winds (&gt;40 km/h) for early warning.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              4-Tier Geographic Hierarchy
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Structured MongoDB models for State → District → Block → Gram
              Panchayat with coordinates, elevation, and vegetation indices.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Pluggable AI/ML Service Contract
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Clean separation between Express controllers and{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                generatePanchayatForecast()
              </code>{' '}
              ready for FastAPI ML model integration.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        GramVayu Prototype • Smart India Hackathon Problem Statement: Block to
        Panchayat Weather Forecast Downscaling
      </footer>
    </div>
  );
};
