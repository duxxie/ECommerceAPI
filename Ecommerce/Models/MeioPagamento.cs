using System.Text.Json.Serialization;

namespace Ecommerce.Models
{
    public class MeioPagamento
    {
        public int Id { get; set; }

        // Ex: "Cartão de Crédito", "Pix", "Boleto", "Transferência"
        public string Tipo { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        // Relacionamentos
        [JsonIgnore]//Corrigir depois DTO
        public List<Fatura> Faturas { get; set; } = new();
    }
}
