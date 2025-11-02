namespace Ecommerce.Models
{
    public class MeioPagamento
    {
        public int Id { get; set; }

        // Ex: "Cartão de Crédito", "Pix", "Boleto", "Transferência"
        public string Tipo { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        // Relacionamentos
        public List<Fatura> Faturas { get; set; } = new();
    }
}
