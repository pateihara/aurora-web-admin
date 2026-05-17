//src/app/page.js

"use client";

import { useEffect, useMemo, useState } from "react";
import { initialStations } from "./data/stations";
import { initialReviews } from "./data/reviews";

const STORAGE_KEY = "aurora-flui-stations";

const views = {
  dashboard: {
    title: "Dashboard",
    sub: "Visão geral da rede · atualizado agora",
  },
  pontos: {
    title: "Pontos de recarga",
    sub: "Gestão dos eletropostos cadastrados",
  },
  avaliacoes: {
    title: "Avaliações",
    sub: "Avaliações dos motoristas por ponto de recarga",
  },
  relatorios: {
    title: "Relatórios e métricas",
    sub: "Dados simulados de uso da rede",
  },
  cadastro: {
    title: "Cadastrar / editar ponto",
    sub: "Preencha os dados do eletroposto",
  },
};

const emptyForm = {
  id: "",
  name: "",
  address: "",
  city: "Curitiba",
  state: "PR",
  status: "Livre",
  chargersAvailable: 1,
  chargersTotal: 2,
  rating: 4,
  power: 150,
  monthlyCharges: 0,
  connectors: ["CCS2"],
  amenities: ["Wi-Fi"],
  openingHours: "24 horas",
  fluiSelect: false,
};

function loadStationsFromStorage() {
  if (typeof window === "undefined") {
    return initialStations;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return initialStations;
  }

  try {
    const parsedStations = JSON.parse(stored);

    if (Array.isArray(parsedStations) && parsedStations.length > 0) {
      return parsedStations;
    }

    return initialStations;
  } catch {
    return initialStations;
  }
}

function getInitialSelectedId() {
  const stations = loadStationsFromStorage();
  return stations[0]?.id || initialStations[0].id;
}

function stars(value) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function statusClass(status) {
  if (status === "Livre") return "bg";
  if (status === "Parcial") return "ba";
  return "br";
}

function metricNumber(value) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function Home() {
  const [view, setView] = useState("dashboard");
  const [stations, setStations] = useState(loadStationsFromStorage);
  const [selectedId, setSelectedId] = useState(getInitialSelectedId);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [connectorFilter, setConnectorFilter] = useState("Todos");
  const [reviewStationFilter, setReviewStationFilter] = useState("Todos");

  const [form, setForm] = useState(emptyForm);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stations));
  }, [stations]);

  const selectedStation = useMemo(() => {
    return stations.find((station) => station.id === selectedId) || stations[0];
  }, [stations, selectedId]);

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const term = search.toLowerCase();

      const matchesSearch =
        station.name.toLowerCase().includes(term) ||
        station.address.toLowerCase().includes(term) ||
        station.city.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "Todos" || station.status === statusFilter;

      const matchesConnector =
        connectorFilter === "Todos" ||
        station.connectors.includes(connectorFilter);

      return matchesSearch && matchesStatus && matchesConnector;
    });
  }, [stations, search, statusFilter, connectorFilter]);

  const filteredReviews = useMemo(() => {
    if (reviewStationFilter === "Todos") {
      return initialReviews;
    }

    return initialReviews.filter(
      (review) => review.stationId === reviewStationFilter
    );
  }, [reviewStationFilter]);

  const totalChargers = stations.reduce(
    (acc, station) => acc + Number(station.chargersTotal),
    0
  );

  const freeChargers = stations.reduce(
    (acc, station) => acc + Number(station.chargersAvailable),
    0
  );

  const averageRating =
    stations.reduce((acc, station) => acc + Number(station.rating), 0) /
    stations.length;

  const onlineStations = stations.filter(
    (station) => station.status !== "Offline"
  ).length;

  function changeView(nextView) {
    setView(nextView);
    setSavedMessage("");
  }

  function startCreate() {
    setForm({
      ...emptyForm,
      id: "",
    });

    changeView("cadastro");
  }

  function startEdit(station) {
    setForm({
      ...station,
      connectors: [...station.connectors],
      amenities: [...station.amenities],
    });

    changeView("cadastro");
  }

  function handleFormChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleArrayValue(field, value) {
    setForm((current) => {
      const exists = current[field].includes(value);

      return {
        ...current,
        [field]: exists
          ? current[field].filter((item) => item !== value)
          : [...current[field], value],
      };
    });
  }

  function saveStation(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.address.trim()) {
      setSavedMessage("Preencha pelo menos o nome e o endereço do ponto.");
      return;
    }

    if (form.connectors.length === 0) {
      setSavedMessage("Selecione pelo menos um tipo de conector.");
      return;
    }

    const normalizedStation = {
      ...form,
      chargersAvailable: Number(form.chargersAvailable),
      chargersTotal: Number(form.chargersTotal),
      rating: Number(form.rating),
      power: Number(form.power),
      monthlyCharges: Number(form.monthlyCharges),
    };

    if (normalizedStation.chargersAvailable > normalizedStation.chargersTotal) {
      setSavedMessage(
        "O número de carregadores disponíveis não pode ser maior que o total."
      );
      return;
    }

    if (form.id) {
      setStations((current) =>
        current.map((station) =>
          station.id === form.id ? normalizedStation : station
        )
      );

      setSelectedId(form.id);
      setSavedMessage("Ponto atualizado com sucesso.");
    } else {
      const newStation = {
        ...normalizedStation,
        id: crypto.randomUUID(),
      };

      setStations((current) => [newStation, ...current]);
      setSelectedId(newStation.id);
      setSavedMessage("Novo ponto cadastrado com sucesso.");
    }

    setTimeout(() => {
      changeView("pontos");
    }, 600);
  }

  function deactivateStation(id) {
    setStations((current) =>
      current.map((station) =>
        station.id === id
          ? {
              ...station,
              status: "Offline",
              chargersAvailable: 0,
            }
          : station
      )
    );
  }

  function resetMockData() {
    setStations(initialStations);
    setSelectedId(initialStations[0].id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStations));
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-row">
            <div className="logo-dot">⚡</div>

            <div>
              <div className="logo-name">aurora</div>
              <div className="logo-tag">Painel administrativo · Flui</div>
            </div>
          </div>
        </div>

        <nav>
          <div className="nav-section">
            <div className="nav-label">Principal</div>

            <button
              className={`nav-item ${view === "dashboard" ? "active" : ""}`}
              type="button"
              onClick={() => changeView("dashboard")}
            >
              <span>▦</span> Dashboard
            </button>

            <button
              className={`nav-item ${view === "pontos" ? "active" : ""}`}
              type="button"
              onClick={() => changeView("pontos")}
            >
              <span>⌖</span> Pontos de recarga
            </button>

            <button
              className={`nav-item ${view === "avaliacoes" ? "active" : ""}`}
              type="button"
              onClick={() => changeView("avaliacoes")}
            >
              <span>★</span> Avaliações
            </button>

            <button
              className={`nav-item ${view === "relatorios" ? "active" : ""}`}
              type="button"
              onClick={() => changeView("relatorios")}
            >
              <span>↗</span> Relatórios
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-label">Gestão</div>

            <button
              className={`nav-item ${view === "cadastro" ? "active" : ""}`}
              type="button"
              onClick={startCreate}
            >
              <span>＋</span> Novo ponto
            </button>

            <button className="nav-item" type="button" onClick={resetMockData}>
              <span>↺</span> Resetar dados
            </button>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-row">
            <div className="uav">FS</div>

            <div>
              <div className="uname">Flui Staff</div>
              <div className="urole">Administrador</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1 className="tb-title">{views[view].title}</h1>
            <p className="tb-sub">{views[view].sub}</p>
          </div>

          <div className="tb-actions">
            {view !== "cadastro" && (
              <>
                <button className="btn-g" type="button">
                  Exportar
                </button>

                <button className="btn-p" type="button" onClick={startCreate}>
                  ＋ Novo ponto
                </button>
              </>
            )}

            {view === "cadastro" && (
              <button
                className="btn-g"
                type="button"
                onClick={() => changeView("pontos")}
              >
                Cancelar
              </button>
            )}
          </div>
        </header>

        <section className="content">
          {view === "dashboard" && (
            <Dashboard
              stations={stations}
              totalChargers={totalChargers}
              freeChargers={freeChargers}
              averageRating={averageRating}
              onlineStations={onlineStations}
              changeView={changeView}
              startEdit={startEdit}
            />
          )}

          {view === "pontos" && selectedStation && (
            <StationsView
              stations={stations}
              filteredStations={filteredStations}
              selectedStation={selectedStation}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              connectorFilter={connectorFilter}
              setConnectorFilter={setConnectorFilter}
              startEdit={startEdit}
              deactivateStation={deactivateStation}
            />
          )}

          {view === "avaliacoes" && (
            <ReviewsView
              stations={stations}
              reviews={filteredReviews}
              reviewStationFilter={reviewStationFilter}
              setReviewStationFilter={setReviewStationFilter}
            />
          )}

          {view === "relatorios" && (
            <ReportsView stations={stations} totalChargers={totalChargers} />
          )}

          {view === "cadastro" && (
            <StationForm
              form={form}
              savedMessage={savedMessage}
              handleFormChange={handleFormChange}
              toggleArrayValue={toggleArrayValue}
              saveStation={saveStation}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function Dashboard({
  stations,
  totalChargers,
  freeChargers,
  averageRating,
  onlineStations,
  changeView,
  startEdit,
}) {
  const attentionStations = stations.filter(
    (station) => station.status !== "Livre" || station.rating < 4
  );

  return (
    <div className="view active">
      <div className="metrics">
        <Metric
          label="Total de pontos"
          value={stations.length}
          detail="+3 este mês"
        />

        <Metric
          label="Carregadores livres"
          value={freeChargers}
          detail={`de ${totalChargers} total`}
          green
        />

        <Metric
          label="Avaliação média"
          value={averageRating.toFixed(1)}
          detail="+0.1 vs mês anterior"
          purple
        />

        <Metric
          label="Pontos online"
          value={onlineStations}
          detail="rede monitorada"
        />
      </div>

      <div className="alert">
        <strong>Flui Portão</strong> está offline há 4 dias — revisão
        necessária.
        <button className="link-button" type="button" onClick={() => changeView("pontos")}>
          Ver ponto →
        </button>
      </div>

      <div className="two-col">
        <Panel title="Mapa da rede">
          <MiniMap />

          <div className="legend-row">
            <span>
              <i className="dot green" /> Livres
            </span>
            <span>
              <i className="dot amber" /> Parciais
            </span>
            <span>
              <i className="dot red" /> Offline
            </span>
          </div>
        </Panel>

        <Panel title="Status da rede agora">
          {stations.slice(0, 5).map((station) => (
            <div className="sitem" key={station.id}>
              <div className={`sdot ${station.status.toLowerCase()}`} />

              <div className="sname">
                <div className="sn">{station.name}</div>
                <div className="sa">
                  {station.chargersAvailable}/{station.chargersTotal} livres ·{" "}
                  {station.power} kW
                </div>
              </div>

              <span className={`badge ${statusClass(station.status)}`}>
                {station.status}
              </span>
            </div>
          ))}
        </Panel>
      </div>

      <div className="two-col">
        <Panel title="Recargas por dia — últimos 7 dias">
          <div className="barchart">
            {[82, 94, 78, 110, 132, 118, 96].map((value, index) => (
              <div className="bcol" key={`${value}-${index}`}>
                <div className="bval">{value}</div>

                <div
                  className={`bbar ${index === 4 ? "highlight" : ""}`}
                  style={{ height: `${(value / 132) * 100}%` }}
                />

                <div className="blbl">
                  {["seg", "ter", "qua", "qui", "sex", "sáb", "dom"][index]}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Últimas avaliações">
          {initialReviews.slice(0, 3).map((review) => (
            <ReviewItem review={review} key={review.id} />
          ))}
        </Panel>
      </div>

      <Panel title="Pontos que precisam de atenção">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Ponto</th>
                <th>Status</th>
                <th>Carregadores</th>
                <th>Avaliação</th>
                <th>Potência</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              {attentionStations.map((station) => (
                <tr key={station.id}>
                  <td>
                    <div className="td-name">{station.name}</div>
                    <div className="td-addr">{station.address}</div>
                  </td>

                  <td>
                    <span className={`badge ${statusClass(station.status)}`}>
                      {station.status}
                    </span>
                  </td>

                  <td>
                    {station.chargersAvailable} / {station.chargersTotal}
                  </td>

                  <td className="td-rating">★ {station.rating}</td>

                  <td>{station.power} kW</td>

                  <td>
                    <button
                      className="act-btn"
                      type="button"
                      onClick={() => startEdit(station)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function StationsView({
  filteredStations,
  selectedStation,
  selectedId,
  setSelectedId,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  connectorFilter,
  setConnectorFilter,
  startEdit,
  deactivateStation,
}) {
  return (
    <div className="view active">
      <div className="filters-row">
        <input
          className="search-input"
          placeholder="Buscar por nome, endereço ou cidade..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="select-input"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option>Todos</option>
          <option>Livre</option>
          <option>Parcial</option>
          <option>Offline</option>
        </select>

        <select
          className="select-input"
          value={connectorFilter}
          onChange={(event) => setConnectorFilter(event.target.value)}
        >
          <option>Todos</option>
          <option>CCS2</option>
          <option>CHAdeMO</option>
          <option>Type 2</option>
          <option>GB/T</option>
        </select>
      </div>

      <div className="list-layout">
        <Panel title={`Lista de pontos (${filteredStations.length})`} noPadding>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ponto</th>
                  <th>Status</th>
                  <th>Carregadores</th>
                  <th>Avaliação</th>
                  <th>Potência</th>
                  <th>Ação</th>
                </tr>
              </thead>

              <tbody>
                {filteredStations.map((station) => (
                  <tr
                    key={station.id}
                    className={station.id === selectedId ? "sel" : ""}
                    onClick={() => setSelectedId(station.id)}
                  >
                    <td>
                      <div className="td-name">{station.name}</div>
                      <div className="td-addr">
                        {station.address} · {station.city}
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${statusClass(station.status)}`}>
                        {station.status}
                      </span>
                    </td>

                    <td>
                      {station.chargersAvailable} / {station.chargersTotal}
                    </td>

                    <td className="td-rating">★ {station.rating}</td>

                    <td>{station.power} kW</td>

                    <td>
                      <button
                        className="act-btn"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          startEdit(station);
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredStations.length === 0 && (
                  <tr>
                    <td colSpan="6">Nenhum ponto encontrado com os filtros atuais.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <aside className="detail-side">
          <div>
            <div className="detail-title-row">
              <div>
                <div className="ds-name">{selectedStation.name}</div>
                <div className="ds-addr">
                  {selectedStation.address} · {selectedStation.city}
                </div>
              </div>

              <span className={`badge ${statusClass(selectedStation.status)}`}>
                {selectedStation.status}
              </span>
            </div>
          </div>

          <MiniMap compact />

          <div className="ds-stat">
            <div className="ds-box">
              <div className="ds-bl">Disponíveis</div>
              <div className="ds-bv g">
                {selectedStation.chargersAvailable} /{" "}
                {selectedStation.chargersTotal}
              </div>
            </div>

            <div className="ds-box">
              <div className="ds-bl">Avaliação</div>
              <div className="ds-bv p">★ {selectedStation.rating}</div>
            </div>

            <div className="ds-box">
              <div className="ds-bl">Potência</div>
              <div className="ds-bv">{selectedStation.power} kW</div>
            </div>

            <div className="ds-box">
              <div className="ds-bl">Recargas/mês</div>
              <div className="ds-bv g">{selectedStation.monthlyCharges}</div>
            </div>
          </div>

          <div>
            <div className="slabel">Conectores</div>

            <div className="tag-row">
              {selectedStation.connectors.map((connector) => (
                <span className="tag" key={connector}>
                  {connector}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="slabel">Comodidades</div>

            <div className="tag-row">
              {selectedStation.amenities.map((amenity) => (
                <span className="tag" key={amenity}>
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {selectedStation.fluiSelect && (
            <div className="select-box">Selo Flui Select ativo</div>
          )}

          <button
            className="btn-p full"
            type="button"
            onClick={() => startEdit(selectedStation)}
          >
            Editar ponto
          </button>

          <button
            className="btn-danger"
            type="button"
            onClick={() => deactivateStation(selectedStation.id)}
          >
            Desativar ponto
          </button>
        </aside>
      </div>
    </div>
  );
}

function ReviewsView({
  stations,
  reviews,
  reviewStationFilter,
  setReviewStationFilter,
}) {
  const average =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length ||
    0;

  return (
    <div className="view active">
      <div className="filters-row">
        <select
          className="select-input"
          value={reviewStationFilter}
          onChange={(event) => setReviewStationFilter(event.target.value)}
        >
          <option value="Todos">Todos os pontos</option>

          {stations.map((station) => (
            <option value={station.id} key={station.id}>
              {station.name}
            </option>
          ))}
        </select>

        <div className="filter-pill">Período: últimos 30 dias</div>
        <div className="filter-pill">Dados simulados</div>
      </div>

      <div className="two-col">
        <Panel title="Resumo das avaliações">
          <div className="score-grid">
            <div className="big-score">
              <div className="bsn">{average.toFixed(1)}</div>
              <div className="bss">★★★★☆</div>
              <div className="bsc">{reviews.length} avaliações filtradas</div>
            </div>

            <div className="crit-list">
              <Crit label="Disponibilidade" value={4.4} />
              <Crit label="Qualidade" value={4.1} />
              <Crit label="Comodidades" value={3.7} purple />
              <Crit label="Sinalização" value={4.2} />
            </div>
          </div>
        </Panel>

        <Panel title="Top pontos por avaliação">
          {[...stations]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map((station, index) => (
              <div className="top-item" key={station.id}>
                <span className="top-rank">{index + 1}</span>
                <span className="top-name">{station.name}</span>

                <div className="top-bar">
                  <div
                    className="top-fill"
                    style={{ width: `${station.rating * 20}%` }}
                  />
                </div>

                <span className="top-score">{station.rating}</span>
              </div>
            ))}
        </Panel>
      </div>

      <Panel title="Avaliações recentes">
        {reviews.map((review) => (
          <ReviewItem review={review} key={review.id} detailed />
        ))}

        {reviews.length === 0 && (
          <p className="empty-text">Nenhuma avaliação encontrada para este ponto.</p>
        )}
      </Panel>
    </div>
  );
}

function ReportsView({ stations, totalChargers }) {
  const totalCharges = stations.reduce(
    (acc, station) => acc + Number(station.monthlyCharges),
    0
  );

  const totalKwh = totalCharges * 15;

  return (
    <div className="view active">
      <div className="metrics">
        <Metric
          label="Recargas no mês"
          value={metricNumber(totalCharges)}
          detail="+18% vs abril"
          green
        />

        <Metric
          label="kWh distribuídos"
          value={metricNumber(totalKwh)}
          detail="+22%"
        />

        <Metric
          label="Carregadores totais"
          value={totalChargers}
          detail="rede Flui"
        />

        <Metric label="Horário de pico" value="18h" detail="18h–19h" purple />
      </div>

      <div className="two-col">
        <Panel title="Recargas por semana — maio 2026">
          <div className="barchart">
            {[712, 890, 1080, 1270, 289].map((value, index) => (
              <div className="bcol" key={`${value}-${index}`}>
                <div className="bval">{value}</div>

                <div
                  className={`bbar ${index === 3 ? "highlight" : ""}`}
                  style={{ height: `${(value / 1270) * 100}%` }}
                />

                <div className="blbl">S{index + 1}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Distribuição por conector">
          <div className="donut-wrap">
            <div className="donut">
              <div className="donut-inner">
                <strong>{metricNumber(totalCharges)}</strong>
                <span>recargas</span>
              </div>
            </div>

            <div className="donut-leg">
              <div className="dleg">
                <i className="dot green" /> CCS2 <strong>58%</strong>
              </div>

              <div className="dleg">
                <i className="dot purple" /> CHAdeMO <strong>22%</strong>
              </div>

              <div className="dleg">
                <i className="dot amber" /> Type 2 <strong>13%</strong>
              </div>

              <div className="dleg">
                <i className="dot gray" /> Outros <strong>7%</strong>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Top pontos por volume">
        {[...stations]
          .sort((a, b) => b.monthlyCharges - a.monthlyCharges)
          .map((station, index) => (
            <div className="top-item" key={station.id}>
              <span className="top-rank">{index + 1}</span>
              <span className="top-name">{station.name}</span>

              <div className="top-bar">
                <div
                  className="top-fill"
                  style={{
                    width: `${Math.min(station.monthlyCharges / 6, 100)}%`,
                  }}
                />
              </div>

              <span className="top-score">{station.monthlyCharges}</span>
            </div>
          ))}
      </Panel>
    </div>
  );
}

function StationForm({
  form,
  savedMessage,
  handleFormChange,
  toggleArrayValue,
  saveStation,
}) {
  const connectorOptions = ["CCS2", "CHAdeMO", "Type 2", "AC", "GB/T"];

  const amenityOptions = [
    "Café",
    "Wi-Fi",
    "Shopping",
    "Estacionamento",
    "Acessível",
    "Banheiro",
  ];

  return (
    <form className="view active" onSubmit={saveStation}>
      {savedMessage && <div className="success-box">{savedMessage}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label className="flabel">Nome do ponto</label>

          <input
            className="finput"
            value={form.name}
            onChange={(event) => handleFormChange("name", event.target.value)}
            placeholder="Ex: Flui Batel"
          />
        </div>

        <div className="form-group">
          <label className="flabel">Status</label>

          <select
            className="finput"
            value={form.status}
            onChange={(event) => handleFormChange("status", event.target.value)}
          >
            <option>Livre</option>
            <option>Parcial</option>
            <option>Offline</option>
          </select>
        </div>

        <div className="form-group wide">
          <label className="flabel">Endereço completo</label>

          <input
            className="finput"
            value={form.address}
            onChange={(event) =>
              handleFormChange("address", event.target.value)
            }
            placeholder="Rua, número, bairro"
          />
        </div>

        <div className="form-group">
          <label className="flabel">Cidade</label>

          <input
            className="finput"
            value={form.city}
            onChange={(event) => handleFormChange("city", event.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="flabel">Estado</label>

          <input
            className="finput"
            value={form.state}
            onChange={(event) => handleFormChange("state", event.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="flabel">Carregadores disponíveis</label>

          <input
            className="finput"
            type="number"
            min="0"
            value={form.chargersAvailable}
            onChange={(event) =>
              handleFormChange("chargersAvailable", event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label className="flabel">Total de carregadores</label>

          <input
            className="finput"
            type="number"
            min="1"
            value={form.chargersTotal}
            onChange={(event) =>
              handleFormChange("chargersTotal", event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label className="flabel">Potência máxima (kW)</label>

          <input
            className="finput"
            type="number"
            value={form.power}
            onChange={(event) => handleFormChange("power", event.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="flabel">Avaliação média</label>

          <input
            className="finput"
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={(event) => handleFormChange("rating", event.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="flabel">Recargas/mês</label>

          <input
            className="finput"
            type="number"
            value={form.monthlyCharges}
            onChange={(event) =>
              handleFormChange("monthlyCharges", event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label className="flabel">Horário de funcionamento</label>

          <input
            className="finput"
            value={form.openingHours}
            onChange={(event) =>
              handleFormChange("openingHours", event.target.value)
            }
          />
        </div>

        <div className="form-group wide">
          <label className="flabel">Tipos de conector</label>

          <div className="fchips">
            {connectorOptions.map((connector) => (
              <button
                type="button"
                key={connector}
                className={`fchip ${
                  form.connectors.includes(connector) ? "on" : "off"
                }`}
                onClick={() => toggleArrayValue("connectors", connector)}
              >
                {connector}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group wide">
          <label className="flabel">Comodidades próximas</label>

          <div className="fchips">
            {amenityOptions.map((amenity) => (
              <button
                type="button"
                key={amenity}
                className={`fchip ${
                  form.amenities.includes(amenity) ? "on" : "off"
                }`}
                onClick={() => toggleArrayValue("amenities", amenity)}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        <label className="check-row wide">
          <input
            type="checkbox"
            checked={form.fluiSelect}
            onChange={(event) =>
              handleFormChange("fluiSelect", event.target.checked)
            }
          />
          Ativar selo Flui Select
        </label>

        <div className="form-group wide">
          <label className="flabel">Localização no mapa</label>
          <MiniMap formMap />
        </div>

        <div className="form-actions wide">
          <button className="btn-p" type="submit">
            Salvar ponto
          </button>
        </div>
      </div>
    </form>
  );
}

function Metric({ label, value, detail, green, purple }) {
  return (
    <div className="metric">
      <div className="ml">{label}</div>

      <div className={`mv ${green ? "g" : ""} ${purple ? "p" : ""}`}>
        {value}
      </div>

      <div className="md up">{detail}</div>
    </div>
  );
}

function Panel({ title, children, noPadding }) {
  return (
    <div className={`panel ${noPadding ? "no-padding" : ""}`}>
      <div className="panel-hdr">
        <span className="panel-title">{title}</span>
      </div>

      {children}
    </div>
  );
}

function MiniMap({ compact, formMap }) {
  return (
    <div
      className={`mmap ${compact ? "compact" : ""} ${
        formMap ? "form-map" : ""
      }`}
    >
      <div className="map-road road-1" />
      <div className="map-road road-2" />
      <div className="map-road road-3" />

      <div className="map-block block-1" />
      <div className="map-block block-2" />
      <div className="map-block block-3" />
      <div className="map-block block-4" />

      <div className="mpin pin-1 green" />
      <div className="mpin pin-2 amber" />
      <div className="mpin pin-3 red" />
      <div className="mpin pin-4 green" />

      {formMap && <div className="map-hint">Clique para ajustar pin</div>}
    </div>
  );
}

function ReviewItem({ review, detailed }) {
  return (
    <div className="rev-item">
      <div className="rav">{review.initials}</div>

      <div className="rbody">
        <div className="rtop">
          <span className="ruser">{review.user}</span>
          <span className="stars">{stars(review.rating)}</span>
        </div>

        <div className="rpoint">
          {review.stationName} · {review.time}
        </div>

        <div className="rtext">{review.comment}</div>

        {detailed && (
          <div className="rcrit">
            <div className="cchip">
              Disponibilidade <span>{review.criteria.disponibilidade}</span>
            </div>

            <div className="cchip">
              Qualidade <span>{review.criteria.qualidade}</span>
            </div>

            <div className="cchip">
              Comodidades <span>{review.criteria.comodidades}</span>
            </div>

            <div className="cchip">
              Sinalização <span>{review.criteria.sinalizacao}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Crit({ label, value, purple }) {
  return (
    <div className="crit-row">
      <span className="crit-name">{label}</span>

      <div className="crit-bar">
        <div
          className={`crit-fill ${purple ? "purple" : ""}`}
          style={{ width: `${value * 20}%` }}
        />
      </div>

      <span className={`crit-val ${purple ? "purple" : ""}`}>{value}</span>
    </div>
  );
}