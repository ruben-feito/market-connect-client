import { useMemo } from 'react';
import { Chip, SvgIcon } from '@mui/material';
import AlignLeft02Icon from '../../icons/untitled-ui/duocolor/align-left-02';
import BarChartSquare02Icon from '../../icons/untitled-ui/duocolor/bar-chart-square-02';
import Building04Icon from '../../icons/untitled-ui/duocolor/building-04';
import CalendarIcon from '../../icons/untitled-ui/duocolor/calendar';
import CheckDone01Icon from '../../icons/untitled-ui/duocolor/check-done-01';
import CreditCard01Icon from '../../icons/untitled-ui/duocolor/credit-card-01';
import CurrencyBitcoinCircleIcon from '../../icons/untitled-ui/duocolor/currency-bitcoin-circle';
import File01Icon from '../../icons/untitled-ui/duocolor/file-01';
import GraduationHat01Icon from '../../icons/untitled-ui/duocolor/graduation-hat-01';
import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';
import LayoutAlt02Icon from '../../icons/untitled-ui/duocolor/layout-alt-02';
import LineChartUp04Icon from '../../icons/untitled-ui/duocolor/line-chart-up-04';
import Lock01Icon from '../../icons/untitled-ui/duocolor/lock-01';
import LogOut01Icon from '../../icons/untitled-ui/duocolor/log-out-01';
import Mail03Icon from '../../icons/untitled-ui/duocolor/mail-03';
import Mail04Icon from '../../icons/untitled-ui/duocolor/mail-04';
import MessageChatSquareIcon from '../../icons/untitled-ui/duocolor/message-chat-square';
import ReceiptCheckIcon from '../../icons/untitled-ui/duocolor/receipt-check';
import Share07Icon from '../../icons/untitled-ui/duocolor/share-07';
import ShoppingBag03Icon from '../../icons/untitled-ui/duocolor/shopping-bag-03';
import ShoppingCart01Icon from '../../icons/untitled-ui/duocolor/shopping-cart-01';
import Truck01Icon from '../../icons/untitled-ui/duocolor/truck-01';
import Upload04Icon from '../../icons/untitled-ui/duocolor/upload-04';
import Users03Icon from '../../icons/untitled-ui/duocolor/users-03';
import XSquareIcon from '../../icons/untitled-ui/duocolor/x-square';
import { tokens } from '../../locales/tokens';
import { paths } from '../../paths';
import {
  Announcement03,
  BarChartSquare02,
  Briefcase01,
  Briefcase02,
  Building02,
  Certificate01,
  Clapperboard,
  Columns03,
  Coins03,
  CreditCard01,
  CreditCard02,
  FlipBackward,
  HomeSmile,
  LayoutAlt02,
  Lock01,
  MessageChatSquare,
  Package,
  Palette,
  Sale01,
  Sale03,
  Scales02,
  Server04,
  ShoppingBag03,
  ShoppingCart01,
  Tag02,
  Tag03,
  Target01,
  NotificationBox,
  Ticket01,
  Truck01,
  Users03,
  XSquare,
  ZapFast,
} from '@untitled-ui/icons-react';

export const useSections = () => {
  return [
    {
      items: [
        {
          title: 'Inicio',
          path: paths.index,
          icon: (
            <SvgIcon fontSize="small">
              <HomeSmile />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Ventas',
      items: [
        {
          title: 'Pedidos',
          icon: (
            <SvgIcon fontSize="small">
              <Package />
            </SvgIcon>
          ),
          path: paths.orders.index,
        },
        {
          title: 'Envíos',
          path: paths.shipments.index,
          icon: (
            <SvgIcon fontSize="small">
              <Truck01 />
            </SvgIcon>
          ),
        },
        {
          title: 'Carritos abandonados',
          path: paths.carts.index,
          icon: (
            <SvgIcon fontSize="small">
              <XSquare />
            </SvgIcon>
          ),
        },
        {
          title: 'Devoluciones',
          path: paths.returns.index,
          icon: (
            <SvgIcon fontSize="small">
              <FlipBackward />
            </SvgIcon>
          ),
        },
        {
          title: 'Tax free',
          path: paths.taxFree.index,
          icon: (
            <SvgIcon fontSize="small">
              <Ticket01 />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Catálogo',
      items: [
        {
          title: 'Productos',
          path: paths.products.index,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingBag03 />
            </SvgIcon>
          ),
        },
        {
          title: 'Categorías',
          path: paths.categories.index,
          icon: (
            <SvgIcon fontSize="small">
              <LayoutAlt02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Características',
          path: paths.features.index,
          icon: (
            <SvgIcon fontSize="small">
              <ZapFast />
            </SvgIcon>
          ),
        },
        {
          title: 'Colores',
          path: paths.colors.index,
          icon: (
            <SvgIcon fontSize="small">
              <Palette />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Clientes',
      items: [
        {
          title: 'Clientes',
          path: paths.customers.index,
          icon: (
            <SvgIcon fontSize="small">
              <Users03 />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Marketing',
      items: [
        {
          title: 'Descuentos',
          icon: (
            <SvgIcon fontSize="small">
              <Sale01 />
            </SvgIcon>
          ),
          items: [
            {
              title: 'Descuentos del catálogo',
              path: paths.discounts.index,
            },
            {
              title: 'Promociones del carrito',
              path: paths.promotions.index,
            },
          ],
        },
        {
          title: 'Uso de promociones',
          path: paths.promotions.usage,
          icon: (
            <SvgIcon fontSize="small">
              <Tag03 />
            </SvgIcon>
          ),
        },
        {
          title: 'Tarjetas regalo',
          icon: (
            <SvgIcon fontSize="small">
              <CreditCard02 />
            </SvgIcon>
          ),
        },
      ],
    },

    {
      subheader: 'Tiendas',
      items: [
        {
          title: 'Tiendas online',
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingCart01 />
            </SvgIcon>
          ),
        },
        {
          title: 'Tiendas físicas',
          path: paths.pickupStores.index,
          icon: (
            <SvgIcon fontSize="small">
              <Building02 />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Reportes',
      items: [
        {
          title: 'Reporte de ventas',
          path: paths.reports.sales,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Reporte de usuarios',
          path: paths.reports.customers,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Reporte de bestsellers',
          path: paths.reports.bestsellers,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Reporte de devoluciones',
          path: paths.reports.refunds,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Reporte de contabilidad',
          path: paths.reports.accounting,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Gestor de Contenido',
      items: [
        {
          title: 'Anuncios de la tienda',
          icon: (
            <SvgIcon fontSize="small">
              <Announcement03 />
            </SvgIcon>
          ),
          path: paths.announcements.index,
        },
        {
          title: 'PopUps',
          icon: (
            <SvgIcon fontSize="small">
              <NotificationBox />
            </SvgIcon>
          ),
          path: paths.popups.index,
        },
        {
          title: 'Menú - Imagenes',
          icon: (
            <SvgIcon fontSize="small">
              <Columns03 />
            </SvgIcon>
          ),
          path: paths.menu.index,
        },
        {
          title: 'Centro de Ayuda',
          icon: (
            <SvgIcon fontSize="small">
              <Scales02 />
            </SvgIcon>
          ),
          path: paths.help.index,
        },
        {
          title: 'Página de inicio',
          icon: (
            <SvgIcon fontSize="small">
              <Clapperboard />
            </SvgIcon>
          ),
          items: [
            {
              title: 'Home',
              path: paths.layoutHomeWeb.index,
            },

            {
              title: 'Sliders',
              path: paths.adminContent.home.sliders,
            },
            {
              subheader: 'Banners',
              title: 'Banners',
              items: [
                {
                  title: 'Text',
                  path: paths.adminContent.home.bannerText,
                },
                {
                  title: 'Images',
                  path: paths.adminContent.home.bannerImages,
                },
              ],
            },
            {
              title: 'Buttons',
              path: paths.adminContent.home.buttons,
            },
            {
              title: 'Categorías',
              path: paths.adminContent.home.categories,
            },
            {
              title: 'Blog',
              path: paths.adminContent.home.blogs,
            },
            {
              title: 'Instagram',
              path: paths.adminContent.home.instagram,
            },
          ],
        },
      ],
    },
    {
      subheader: 'Recursos Humanos',
      path: paths.rrhh.index,
      items: [
        {
          title: 'Ofertas de empleo',
          icon: (
            <SvgIcon fontSize="small">
              <Briefcase01 />
            </SvgIcon>
          ),
          path: paths.rrhh.index,
        },
      ],
    },
    {
      subheader: 'Sistema',
      items: [
        {
          title: 'Procesos',
          icon: (
            <SvgIcon fontSize="small">
              <Server04 />
            </SvgIcon>
          ),
          path: paths.system.processes.index,
        },
        {
          title: 'Gestión de cuentas',
          path: paths.accounts.index,
          icon: (
            <SvgIcon fontSize="small">
              <Lock01 />
            </SvgIcon>
          ),
          items: [
            {
              title: 'Listado de cuentas',
              path: paths.accounts.list.index,
            },
            {
              title: 'Roles y permisos',
              path: paths.accounts.roles.index,
            },
          ],
        },
      ],
    },
  ];
};
