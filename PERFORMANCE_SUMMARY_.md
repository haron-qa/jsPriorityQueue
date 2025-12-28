# Rigorous Performance Report
**Iterations**: 100
**Items per Iteration**: 1,000,000

| Implementation | Average (ms) | Median (ms) | Min (ms) | Max (ms) |
|---|---|---|---|---|
| **FastPriorityQueue** | 297.57 | 296.85 | 107.72 | 347.39 |
| **jsPriorityQueue** | **322.33** | **322.09** | **120.78** | **374.37** |
| **TinyQueue** | 291.64 | 293.48 | 125.28 | 363.01 |
| **FastPriorityQueue comparator** | 297.57 | 296.85 | 107.72 | 347.39 |
| **jsPriorityQueue comparator** | **327.19** | **323.82** | **309.94** | **446.67** |
| **TinyQueue comparator** | 331.40 | 326.65 | 311.41 | 466.14 |
| **Array.sort** | 282.49 | 279.54 | 269.40 | 355.97 |

*Generated on 2025-12-28T04:03:13.412Z*

**Mannually added notes:** no comparator results are better for queues (see below), and it is in lime with Min column in the table above.

| Implementation | Average (ms) | Median (ms) | Min (ms) | Max (ms) |
|---|---|---|---|---|
| **FastPriorityQueue** | 113.99 | 114.24 | 105.21 | 118.96 |
| **jsPriorityQueue** | **123.88** | **124.00** | **116.71** | **148.69** |
| **TinyQueue** | 127.69 | 127.97 | 121.83 | 133.38 |
| **Array.sort** | 277.02 | 275.62 | 268.27 | 306.23 |

*Generated on 2025-12-28T03:46:21.126Z*
