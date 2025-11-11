namespace Ecommerce.Models
{
    public enum MeioPagamentoTipo
    {
        CartaoCredito = 1,
        Pix = 2,
        Boleto = 3,
        Transferencia = 4
    }

    public enum StatusPagamento
    {
        Aguardando = 1,
        Pago = 2,
        Estornado = 3,
        Cancelado = 4
    }

    public enum StatusEntrega
    {
        AguardandoSeparacao = 1,
        EmTransporte = 2,
        Entregue = 3,
        Cancelada = 4
    }

    public enum StatusPedido
    {
        Criado = 1,
        Confirmado = 2,
        Faturado = 3,
        Enviado = 4,
        Concluido = 5,
        Cancelado = 6
    }
}