import { TipoPeso } from 'src/_shared/enums/produto/tipoPeso';
import { CreateProdutoDto } from 'src/produto/dto/create-produto.dto';

export function converterPesoParaUnidades(
  sku: string,
  pesoLiquido: number,
  quantidade: number,
  lista: CreateProdutoDto[],
) {
  const produto = lista.find((produto) => produto.sku === sku);

  let unidades = 0;
  let caixas = 0;
  let rest = 0;

  if (produto?.tipoPeso === TipoPeso.PVAR) {
    unidades = 0;
    caixas = quantidade;
  } else {
    unidades =
      Math.round(
        (pesoLiquido / Number(produto?.pesoLiquidoUnidade ?? 0)) * 1000,
      ) / 1000;
    caixas = Math.floor(unidades / Number(produto?.unPorCaixa ?? 0));
    rest = Math.floor(unidades % Number(produto?.unPorCaixa ?? 0));
  }

  return {
    caixas: caixas,
    unidades: rest,
    fatorConversao: Number(produto?.pesoLiquidoUnidade ?? 0),
    unPorCaixa: Number(produto?.unPorCaixa ?? 0),
    decimal: unidades,
  };
}
