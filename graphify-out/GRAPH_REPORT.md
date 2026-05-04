# Graph Report - APL_Ranchi  (2026-05-03)

## Corpus Check
- 4 files · ~3,241 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 25 nodes · 31 edges · 4 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `QuestionSelector` - 8 edges
2. `ProbabilityEngine` - 7 edges
3. `run_simulation()` - 4 edges
4. `main()` - 3 edges
5. `generate_synthetic_player()` - 2 edges
6. `main()` - 2 edges
7. `load_dataset()` - 2 edges
8. `Returns sorted list of players by probability.` - 1 edges
9. `Updates probabilities using Bayesian inference.         response must be one of:` - 1 edges
10. `Returns the player with the highest probability and their score.` - 1 edges

## Surprising Connections (you probably didn't know these)
- `QuestionSelector` --uses--> `ProbabilityEngine`  [INFERRED]
  engine\selector.py → engine\probability.py
- `run_simulation()` --calls--> `ProbabilityEngine`  [INFERRED]
  engine\test_simulation.py → engine\probability.py
- `run_simulation()` --calls--> `QuestionSelector`  [INFERRED]
  engine\test_simulation.py → engine\selector.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.29
Nodes (4): ProbabilityEngine, Returns sorted list of players by probability., Updates probabilities using Bayesian inference.         response must be one of:, Returns the player with the highest probability and their score.

### Community 1 - "Community 1"
Cohesion: 0.32
Nodes (3): QuestionSelector, Returns the attribute that minimizes Expected Entropy.         Falls back to heu, Marks an attribute as asked so it isn't selected again.

### Community 2 - "Community 2"
Cohesion: 0.83
Nodes (3): load_dataset(), main(), run_simulation()

### Community 3 - "Community 3"
Cohesion: 1.0
Nodes (2): generate_synthetic_player(), main()

## Knowledge Gaps
- **5 isolated node(s):** `Returns sorted list of players by probability.`, `Updates probabilities using Bayesian inference.         response must be one of:`, `Returns the player with the highest probability and their score.`, `Returns the attribute that minimizes Expected Entropy.         Falls back to heu`, `Marks an attribute as asked so it isn't selected again.`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 3`** (3 nodes): `generate_synthetic_player()`, `main()`, `generate_dataset.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `QuestionSelector` connect `Community 1` to `Community 0`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.437) - this node is a cross-community bridge._
- **Why does `ProbabilityEngine` connect `Community 0` to `Community 1`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.435) - this node is a cross-community bridge._
- **Why does `run_simulation()` connect `Community 2` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `QuestionSelector` (e.g. with `ProbabilityEngine` and `run_simulation()`) actually correct?**
  _`QuestionSelector` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `ProbabilityEngine` (e.g. with `QuestionSelector` and `run_simulation()`) actually correct?**
  _`ProbabilityEngine` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `run_simulation()` (e.g. with `ProbabilityEngine` and `QuestionSelector`) actually correct?**
  _`run_simulation()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Returns sorted list of players by probability.`, `Updates probabilities using Bayesian inference.         response must be one of:`, `Returns the player with the highest probability and their score.` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._