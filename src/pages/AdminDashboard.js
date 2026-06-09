import React, { useMemo, useState } from "react";
import {
  Archive,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  DollarSign,
  EyeOff,
  FilePenLine,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PackageCheck,
  PackageOpen,
  Pencil,
  Plus,
  Search,
  Settings,
  ShoppingBasket,
  Star,
  Truck,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";

const navigation = [
  { label: "Dashboard Overview", icon: LayoutDashboard },
  { label: "Product Management", icon: ShoppingBasket },
  { label: "Live Order Queue", icon: Zap, badge: "12" },
  { label: "Customer Reviews", icon: MessageSquareText, badge: "3" },
  { label: "News & Blog Management", icon: BookOpen },
  { label: "Store Settings", icon: Settings },
];

const products = [
  {
    emoji: "🍎",
    name: "Organic Red Apples",
    category: "Fruits",
    price: "$6.99",
    discount: "29%",
    stock: "In Stock (142)",
    stockTone: "green",
  },
  {
    emoji: "🍯",
    name: "Organic Honey",
    category: "Pantry",
    price: "$12.99",
    discount: "0%",
    stock: "Low Stock (4)",
    stockTone: "amber",
  },
  {
    emoji: "🥬",
    name: "Fresh Spinach",
    category: "Vegetables",
    price: "$3.99",
    discount: "25%",
    stock: "Out of Stock",
    stockTone: "red",
  },
];

const orders = [
  {
    status: "Incoming / New",
    tone: "amber",
    icon: Zap,
    count: 4,
    entries: [
      { id: "#1027", customer: "Anita S.", item: "Wellness bundle", time: "1 min ago", total: "$28.40" },
      { id: "#1026", customer: "Jordan K.", item: "Bananas x2, Milk", time: "2 min ago", total: "$17.20" },
    ],
  },
  {
    status: "Packing",
    tone: "blue",
    icon: PackageOpen,
    count: 5,
    entries: [
      { id: "#1025", customer: "Sarah M.", item: "Pantry essentials", time: "4 min left", total: "$42.15" },
      { id: "#1023", customer: "David L.", item: "Fresh produce x6", time: "6 min left", total: "$31.80" },
    ],
  },
  {
    status: "Out for Delivery",
    tone: "green",
    icon: Truck,
    count: 3,
    entries: [
      { id: "#1024", customer: "Gokul R.", item: "Apples x3", time: "ETA 4 mins", total: "$20.97", dispatched: true },
      { id: "#1022", customer: "Priya N.", item: "Organic Honey", time: "ETA 7 mins", total: "$12.99" },
    ],
  },
];

const toneClasses = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-rose-50 text-rose-700 ring-rose-600/15",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/15",
};

function StatusBadge({ tone, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${toneClasses[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function IconButton({ label, children, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${className}`}
    >
      {children}
    </button>
  );
}

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard Overview");
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("pending");
  const [toast, setToast] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.category} ${product.stock}`.toLowerCase().includes(query)
    );
  }, [search]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const selectNavigation = (label) => {
    setActiveNav(label);
    setSidebarOpen(false);
    const sectionMap = {
      "Dashboard Overview": "dashboard-top",
      "Product Management": "products",
      "Live Order Queue": "orders",
      "Customer Reviews": "reviews",
      "News & Blog Management": "content",
      "Store Settings": "dashboard-top",
    };
    document.getElementById(sectionMap[label])?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f6f7f3] font-sans text-stone-900">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[286px] flex-col border-r border-white/10 bg-[#153d2b] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-inner">🌿</span>
            <div>
              <p className="text-[15px] font-extrabold tracking-tight">Organic Store</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Admin</p>
            </div>
          </div>
          <button
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200/50">Workspace</p>
          <div className="space-y-1.5">
            {navigation.map(({ label, icon: Icon, badge }) => {
              const active = activeNav === label;
              return (
                <button
                  key={label}
                  onClick={() => selectNavigation(label)}
                  className={`group flex min-h-12 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-semibold transition ${
                    active ? "bg-white text-[#153d2b] shadow-lg shadow-emerald-950/20" : "text-emerald-50/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} strokeWidth={active ? 2.5 : 2} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${active ? "bg-emerald-100 text-emerald-800" : "bg-white/10 text-emerald-100"}`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="m-3 rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-[#153d2b]">
              <Zap size={19} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs font-extrabold">10-minute promise</p>
              <p className="text-[11px] text-emerald-100/60">Operations are on track</p>
            </div>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/20">
            <div className="h-full w-[84%] rounded-full bg-amber-300" />
          </div>
          <p className="mt-2 text-right text-[10px] font-bold text-amber-200">84% on-time today</p>
        </div>
      </aside>

      <div className="lg:pl-[286px]">
        <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f6f7f3]/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <IconButton label="Open navigation" onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={21} />
            </IconButton>

            <div className="relative max-w-2xl flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={19} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm font-medium shadow-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Search orders, products, customers..."
                aria-label="Global search"
              />
            </div>

            <div className="relative">
              <IconButton
                label="Notifications"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
              >
                <Bell size={20} />
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              </IconButton>
              {notificationsOpen && (
                <div className="absolute right-0 top-14 w-80 rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-sm font-extrabold">Notifications</p>
                    <span className="text-xs font-bold text-emerald-700">3 new</span>
                  </div>
                  {["Organic Honey has only 4 units left", "4 new orders need confirmation", "New review awaiting approval"].map((item, index) => (
                    <button key={item} className="flex min-h-12 w-full items-start gap-3 rounded-xl px-3 py-3 text-left hover:bg-stone-50">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${index === 0 ? "bg-amber-500" : "bg-emerald-500"}`} />
                      <span className="text-xs font-semibold leading-5 text-stone-600">{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex h-12 items-center gap-3 rounded-xl border border-stone-200 bg-white px-2.5 pr-3 text-left shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#153d2b] text-white">
                  <UserRound size={17} />
                </span>
                <span>
                  <span className="block text-xs font-extrabold">Admin User</span>
                  <span className="block text-[10px] font-medium text-stone-500">Store manager</span>
                </span>
                <ChevronDown size={15} className="text-stone-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-14 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl">
                  <button className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-stone-600 hover:bg-stone-50">
                    <UserRound size={17} /> My profile
                  </button>
                  <button className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-stone-600 hover:bg-stone-50">
                    <Settings size={17} /> Preferences
                  </button>
                  <button className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                    <LogOut size={17} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main id="dashboard-top" className="mx-auto max-w-[1600px] space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                <span className="h-px w-7 bg-emerald-600" />
                Tuesday, June 9
              </div>
              <h1 className="font-sans text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">Good morning, Admin.</h1>
              <p className="mt-1.5 text-sm font-medium text-stone-500">Here’s what’s happening across Organic Store today.</p>
            </div>
            <button
              onClick={() => notify("Product creation panel opened")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#153d2b] px-5 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              <Plus size={18} /> Add new product
            </button>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Revenue"
              value="$12,450.80"
              detail="+12% this week"
              icon={DollarSign}
              iconClass="bg-emerald-100 text-emerald-700"
              detailClass="text-emerald-700"
            />
            <MetricCard
              label="Active Orders"
              value="42 Pending"
              detail="10 mins avg fulfillment"
              icon={PackageCheck}
              iconClass="bg-sky-100 text-sky-700"
              detailClass="text-sky-700"
            />
            <MetricCard
              label="Low Stock Alert"
              value="5 Items Left"
              detail="Needs action"
              icon={CircleAlert}
              iconClass="bg-amber-100 text-amber-700"
              detailClass="text-amber-700"
              warning
            />
            <MetricCard
              label="Active Customers"
              value="1,284"
              detail="+8.4% this month"
              icon={Users}
              iconClass="bg-violet-100 text-violet-700"
              detailClass="text-violet-700"
            />
          </section>

          <section id="products" className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm scroll-mt-24">
            <SectionHeader
              eyebrow="Catalog control"
              title="Product Management"
              description="Monitor pricing, offers, and inventory availability."
              action={
                <button onClick={() => notify("Showing complete product catalog")} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-stone-200 px-4 text-sm font-bold text-stone-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                  View all products <ChevronRight size={17} />
                </button>
              }
            />

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-y border-stone-100 bg-stone-50/80">
                  <tr className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-stone-400">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Base price</th>
                    <th className="px-5 py-4">Discount</th>
                    <th className="px-5 py-4">Stock status</th>
                    <th className="px-6 py-4 text-right">Quick actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.name} className="group transition hover:bg-emerald-50/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-2xl ring-1 ring-stone-200">{product.emoji}</div>
                          <div>
                            <p className="text-sm font-extrabold text-stone-800">{product.name}</p>
                            <p className="mt-0.5 text-xs font-medium text-stone-400">SKU OS-{product.name.length}24</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-stone-600">{product.category}</td>
                      <td className="px-5 py-4 text-sm font-extrabold text-stone-800">{product.price}</td>
                      <td className="px-5 py-4 text-sm font-bold text-stone-600">{product.discount}</td>
                      <td className="px-5 py-4"><StatusBadge tone={product.stockTone}>{product.stock}</StatusBadge></td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => notify(`Editing ${product.name}`)} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-stone-200 px-3.5 text-xs font-bold text-stone-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                            <Pencil size={15} /> Edit
                          </button>
                          <button onClick={() => notify(product.stockTone === "green" ? `${product.name} hidden` : `Restock request created for ${product.name}`)} className={`inline-flex min-h-12 items-center gap-2 rounded-xl px-3.5 text-xs font-bold transition ${product.stockTone === "green" ? "bg-stone-100 text-stone-600 hover:bg-stone-200" : "bg-[#153d2b] text-white hover:bg-emerald-800"}`}>
                            {product.stockTone === "green" ? <EyeOff size={15} /> : <Box size={15} />}
                            {product.stockTone === "green" ? "Hide" : "Restock"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-stone-100 lg:hidden">
              {filteredProducts.map((product) => (
                <article key={product.name} className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-3xl ring-1 ring-stone-200">{product.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold">{product.name}</p>
                      <p className="mt-1 text-xs font-semibold text-stone-400">{product.category} · {product.price} · {product.discount} off</p>
                      <div className="mt-3"><StatusBadge tone={product.stockTone}>{product.stock}</StatusBadge></div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button onClick={() => notify(`Editing ${product.name}`)} className="min-h-12 rounded-xl border border-stone-200 text-xs font-bold text-stone-600">Edit product</button>
                    <button onClick={() => notify(`Inventory action started for ${product.name}`)} className="min-h-12 rounded-xl bg-[#153d2b] text-xs font-bold text-white">{product.stockTone === "green" ? "Hide product" : "Restock now"}</button>
                  </div>
                </article>
              ))}
              {filteredProducts.length === 0 && <p className="p-8 text-center text-sm font-semibold text-stone-500">No products match “{search}”.</p>}
            </div>
          </section>

          <section id="orders" className="scroll-mt-24">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">Live operations</p>
                <h2 className="mt-1 font-sans text-xl font-black tracking-tight sm:text-2xl">10-Minute Order Queue</h2>
                <p className="mt-1 text-sm font-medium text-stone-500">Every order, moving in real time.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-stone-600 ring-1 ring-stone-200">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                Live sync active
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {orders.map((column) => (
                <OrderColumn key={column.status} column={column} onAction={notify} />
              ))}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.05fr_1.4fr]">
            <div id="reviews" className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm scroll-mt-24">
              <SectionHeader
                eyebrow="Community"
                title="Review Moderation"
                description="1 testimonial is awaiting your decision."
              />
              <div className="border-t border-stone-100 p-5 sm:p-6">
                {reviewStatus === "pending" ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-800">MA</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-extrabold">Mark Antony</p>
                            <p className="text-xs font-semibold text-stone-400">Designer · Verified purchase</p>
                          </div>
                          <div className="flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
                            {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill="currentColor" />)}
                          </div>
                        </div>
                        <blockquote className="mt-4 border-l-2 border-emerald-500 pl-4 text-sm font-medium leading-6 text-stone-600">
                          “The produce was incredibly fresh and arrived faster than expected. The apples were crisp, carefully packed, and exactly as pictured.”
                        </blockquote>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      <button
                        onClick={() => {
                          setReviewStatus("approved");
                          notify("Review approved and published");
                        }}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#153d2b] px-4 text-sm font-bold text-white transition hover:bg-emerald-800"
                      >
                        <Check size={17} /> Approve & Show Live
                      </button>
                      <button
                        onClick={() => {
                          setReviewStatus("archived");
                          notify("Review moved to archive");
                        }}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
                      >
                        <Archive size={17} /> Move to Archive
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-52 flex-col items-center justify-center text-center">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${reviewStatus === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                      {reviewStatus === "approved" ? <Check size={25} /> : <Archive size={24} />}
                    </div>
                    <p className="mt-4 text-sm font-extrabold">Review {reviewStatus}</p>
                    <button onClick={() => setReviewStatus("pending")} className="mt-3 min-h-12 px-4 text-xs font-bold text-emerald-700">Undo action</button>
                  </div>
                )}
              </div>
            </div>

            <div id="content" className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm scroll-mt-24">
              <SectionHeader
                eyebrow="Storefront content"
                title="News & Blog Articles"
                description="Keep promotional stories and healthy-living tips fresh."
                action={
                  <button onClick={() => notify("New article editor opened")} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-50 px-4 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100">
                    <Plus size={17} /> New article
                  </button>
                }
              />
              <div className="grid gap-4 border-t border-stone-100 p-5 sm:grid-cols-2 sm:p-6">
                <ContentCard
                  label="Active banner"
                  title="Farm Fresh in 10 Minutes"
                  detail="Homepage hero · Updated 2h ago"
                  gradient="from-emerald-950 via-emerald-800 to-lime-600"
                  icon={<Leaf size={38} />}
                  onEdit={() => notify("Promotional banner editor opened")}
                />
                <ContentCard
                  label="Lifestyle tip"
                  title="5 ways to make greens last"
                  detail="Healthy living · Published Jun 8"
                  gradient="from-amber-200 via-orange-100 to-stone-50"
                  icon={<BookOpen size={38} />}
                  dark
                  onEdit={() => notify("Lifestyle article editor opened")}
                />
              </div>
              <div className="border-t border-stone-100 px-5 py-4 sm:px-6">
                <button onClick={() => notify("Opening content library")} className="flex min-h-12 w-full items-center justify-between rounded-xl px-1 text-sm font-bold text-stone-600 transition hover:text-emerald-800">
                  Browse all articles and scheduled banners <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[70] flex min-h-12 -translate-x-1/2 items-center gap-3 rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white shadow-2xl">
          <Check size={17} className="text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, detail, icon: Icon, iconClass, detailClass, warning }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {warning && <span className="absolute right-0 top-0 rounded-bl-xl bg-amber-400 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-amber-950">Action needed</span>}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-stone-500">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-stone-900">{value}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={21} />
        </span>
      </div>
      <div className={`mt-4 flex items-center gap-1.5 text-xs font-bold ${detailClass}`}>
        {label === "Total Revenue" ? <ArrowUpRight size={14} /> : label === "Active Customers" ? <ArrowUpRight size={14} /> : label === "Low Stock Alert" ? <ArrowDownRight size={14} /> : <Clock3 size={14} />}
        {detail}
      </div>
    </article>
  );
}

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-700">{eyebrow}</p>
        <h2 className="mt-1 font-sans text-xl font-black tracking-tight text-stone-900">{title}</h2>
        <p className="mt-1 text-sm font-medium text-stone-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function OrderColumn({ column, onAction }) {
  const Icon = column.icon;
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2.5">
          <span className={`relative flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses[column.tone]}`}>
            {column.tone === "amber" && <span className="absolute inset-0 animate-ping rounded-xl bg-amber-300 opacity-20" />}
            <Icon className="relative" size={17} />
          </span>
          <div>
            <h3 className="font-sans text-sm font-extrabold">{column.status}</h3>
            <p className="text-[10px] font-bold text-stone-400">{column.count} active orders</p>
          </div>
        </div>
        <button aria-label={`More options for ${column.status}`} className="flex h-12 w-12 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700">
          <MoreHorizontal size={19} />
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {column.entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-stone-100 bg-stone-50/70 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black">{entry.id}</p>
              <p className="text-xs font-extrabold text-stone-700">{entry.total}</p>
            </div>
            <p className="mt-2 text-xs font-bold text-stone-600">{entry.customer}</p>
            <p className="mt-1 text-xs font-medium text-stone-400">{entry.item}</p>
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-stone-200/70 pt-3">
              <span className={`text-[11px] font-extrabold ${entry.dispatched ? "text-emerald-700" : column.tone === "amber" ? "text-amber-700" : "text-stone-500"}`}>
                {entry.dispatched ? "● Dispatched" : entry.time}
              </span>
              <button onClick={() => onAction(`${entry.id} details opened`)} className="inline-flex min-h-12 items-center gap-1 rounded-lg px-2 text-[11px] font-extrabold text-emerald-800 hover:bg-emerald-100">
                Manage <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ContentCard({ label, title, detail, gradient, icon, dark, onEdit }) {
  return (
    <article className={`relative min-h-48 overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 ${dark ? "text-stone-900" : "text-white"}`}>
      <div className={`absolute -bottom-5 -right-2 rotate-[-12deg] ${dark ? "text-amber-700/20" : "text-white/15"}`}>{React.cloneElement(icon, { size: 110, strokeWidth: 1.5 })}</div>
      <div className="relative flex h-full flex-col">
        <span className={`w-fit rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${dark ? "bg-white/60 text-amber-800" : "bg-white/15 text-emerald-50 ring-1 ring-white/20"}`}>{label}</span>
        <div className="mt-auto">
          <p className="max-w-[230px] text-lg font-black leading-tight">{title}</p>
          <p className={`mt-2 text-[11px] font-semibold ${dark ? "text-stone-600" : "text-emerald-50/70"}`}>{detail}</p>
          <button onClick={onEdit} className={`mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl px-4 text-xs font-extrabold transition ${dark ? "bg-stone-900 text-white hover:bg-stone-700" : "bg-white text-emerald-900 hover:bg-emerald-50"}`}>
            <FilePenLine size={15} /> Edit content
          </button>
        </div>
      </div>
    </article>
  );
}

export default AdminDashboard;
