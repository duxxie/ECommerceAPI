namespace Models.Pedido;

public class Pedido
{
    public int Id { get; set; }
    public DateTime DataPedido { get; set; } = DateTime.Now;
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = "Em processamento";

    public int ClienteId { get; set; }
    public ICollection<ItemPedido> Itens { get; set; } = new List<ItemPedido>();
    public Fatura? Fatura { get; set; }
    public StatusEntrega? StatusEntrega { get; set; }
    public MeioPagamento? MeioPagamento { get; set; }
}