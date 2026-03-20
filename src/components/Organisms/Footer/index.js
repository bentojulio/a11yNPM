import "./styles.css";
import React from "react";

export function Footer({ darkTheme }) {
  const theme = darkTheme === "dark" ? "dark" : ""
  const amaLogoSrc = darkTheme === "dark"
    ? "/img/Logotipo_ARTE__Horizontal_branco_pt.png"
    : "/img/Logotipo_ARTE__Horizontal_cor_pt.png";
  return (
    <footer className={`py-5 ama ${theme}`}>
      <div className="container">
        <nav aria-label="Menu de rodapé do selo.usabilidade.gov.pt" className="mb-4">
          <div className="menu-menu-de-rodape-container">
            <ul id="menu-menu-de-rodape" className="footer-menu ps-0 mb-1">
              <li
                id="menu-item-193"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-193"
              >
                <a
                  href="https://www.acessibilidade.gov.pt/acessibilidade/"
                  rel="noreferrer"
                  className="ama-typography-action-large p-3"
                >
                  Acessibilidade
                </a>
              </li>

              <li
                id="menu-item-194"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-193"
              >
                <a
                  href="https://www.acessibilidade.gov.pt/termos-e-condicoes/"
                  rel="noreferrer"
                  className="ama-typography-action-large p-3"
                >
                  Termos e Condições
                </a>
              </li>

              <li
                id="menu-item-190"
                className="menu-item menu-item-type-custom menu-item-object-custom menu-item-190"
              >
                <a
                  href="https://www.ama.gov.pt/web/agencia-para-a-modernizacao-administrativa/politica-de-privacidade"
                  rel="noreferrer"
                  className="ama-typography-action-large p-3"
                >
                  Política de privacidade
                </a>
              </li>

              <li
                id="menu-item-191"
                className="menu-item menu-item-type-custom menu-item-object-custom menu-item-191"
              >
                <a
                  href="https://amagovpt.github.io/kit-selo/"
                  rel="noreferrer"
                  className="ama-typography-action-large p-3"
                >
                  Github
                </a>
              </li>

              <li
                id="menu-item-192"
                className="menu-item menu-item-type-custom menu-item-object-custom menu-item-192"
              >
                <a
                  href="https://www.acessibilidade.gov.pt/glossario/"
                  rel="noreferrer"
                  className="ama-typography-action-large p-3"
                >
                  Glossário
                </a>
              </li>
              <li
                id="menu-item-68"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-68"
              >
                <a
                  href="https://www.acessibilidade.gov.pt/opcoes-de-visualizacao/"
                  rel="noreferrer"
                  className="ama-typography-action-large p-3"
                >
                  Opções de visualização
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <ul className="footer-logos mb-4">
          <li>
            <img
              decoding="async"
              alt="ARTE - Agência para a Reforma Tecnológica do Estado"
              src={amaLogoSrc}
              width="210"
              className="img-fluid"
            />
          </li>
        </ul>

        <div className="logo-selo mb-3">
          <img
            src="https://selo.leadershipbt.com/wp-content/themes/www-a11y-theme/img/selo-ouro.svg"
            alt="Selo Ouro de Usabilidade e Acessibilidade"
          />
        </div>
        <div className="text-center">
          <p className="ama-typography-body">
            © {(new Date()).getFullYear()} ARTE - Agência para a Reforma Tecnológica do Estado, I.P. Todos
            os Direitos Reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
